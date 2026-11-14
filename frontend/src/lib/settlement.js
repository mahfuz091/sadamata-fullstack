// lib/settlement.js
import prisma from "@/lib/prisma";
import { resolveCommissionAt } from "@/lib/commissionResolver";
import { calculateBonusSplit, resolveBonusScenario } from "@/lib/bonusSplit";
import { getActiveBonusRules } from "@/lib/bonusRule";

/**
 * Writes the brand / merchant / platform split for a paid order.
 *
 * Rates come from the CommissionSetting rules in force at the instant the order
 * settles — NOT from the percentages frozen onto Product at creation time. An
 * admin rate change therefore applies to everything that settles after it.
 *
 * Already-settled orders are never repriced. Three independent guards:
 *   1. An order whose lines already have Sale rows short-circuits the function.
 *   2. The Sale / SaleItem upserts leave an existing row untouched.
 *   3. Rates are resolved as-of the pinned settledAt, so even a deliberate
 *      re-run resolves the same historical rule window.
 */
export async function settleOrderEarnings(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");

  const productIds = order.items.map((i) => i.productId).filter(Boolean);
  if (productIds.length === 0) return; // nothing to settle

  // GUARD 1 — settle exactly once. A replayed webhook must not reprice.
  //
  // Keyed on the Sale rows themselves, NOT on Order.settledAt: the dashboard's
  // "mark as PAID" admin action (dashboard/src/app/actions/order/order.actions.js)
  // also stamps settledAt, and it writes no Sale rows. Trusting settledAt alone
  // would make an admin-marked order skip settlement entirely and pay nobody.
  const alreadySettled = await prisma.sale.count({
    where: { orderItemId: { in: order.items.map((i) => i.id) } },
  });
  if (alreadySettled > 0) return;

  // The rate date for this order. Pinned once, used for every line.
  const settledAt = new Date();

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      userId: true, // product owner = merchant
      brandId: true,
      brandCommissionPct: true, // fallback only
      merchantCommissionPct: true, // fallback only
      User: { select: { role: true } }, // owner role — tier only applies to MERCH
    },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Scenario-based bonus rules (one active rule per scenario) for the order.
  const bonusRules = await getActiveBonusRules();

  // One resolve per (merchant, brand) pair rather than per line.
  const rateCache = new Map();
  const ratesFor = async (product) => {
    const key = `${product.userId}|${product.brandId ?? ""}`;
    if (!rateCache.has(key)) {
      rateCache.set(
        key,
        await resolveCommissionAt({
          merchantId: product.userId,
          brandId: product.brandId || null,
          at: settledAt,
          product,
        }),
      );
    }
    return rateCache.get(key);
  };

  // Resolve everything BEFORE opening the transaction — these are reads against
  // CommissionSetting / Brand and should not hold the write transaction open.
  const lines = [];
  for (const item of order.items) {
    if (!item.productId) continue; // skip lines without productId

    const product = productMap.get(item.productId);
    if (!product) continue;

    const rates = await ratesFor(product);

    const unit = Number(item.unitPrice); // Decimal -> number
    const qty = item.quantity;
    const total = unit * qty;

    // Split the line into the base slice (up to the rule's price threshold) and
    // the above-threshold excess. The base keeps its CommissionSetting
    // resolution; the excess is split by scenario (NO_BRAND / exclusive brand /
    // non-exclusive brand) using the active BonusRule for that scenario.
    //
    // Brand.isExclusive is read live at settlement time (resolveCommissionAt
    // returns it). Sale rows are written once and never repriced, so changing a
    // brand's exclusivity later cannot alter already-settled sales.
    const isExclusive = !!rates.isExclusive;
    const isMerchOwned = product.User?.role === "MERCH";

    // The scenario bonus still only applies to MERCH-owned products.
    const scenario = resolveBonusScenario({
      brandId: product.brandId,
      brandIsExclusive: isExclusive,
    });
    const rule = isMerchOwned ? (bonusRules?.get(scenario) ?? null) : null;

    if (isMerchOwned && !rule) {
      console.warn(
        `[settlement] no active ${scenario} bonus rule; no excess bonus on order ${order.id} item ${item.id}`,
      );
    }

    let brandEarning;
    let merchantEarning;
    let brandExcessEarning;
    let merchantExcessEarning;
    let platformExcessEarning;
    let platformEarning;
    let split = null;

    if (rule) {
      const threshold = Number(rule.priceThreshold);
      const baseLine = Math.min(unit, threshold) * qty;

      split = calculateBonusSplit({
        unitPrice: unit,
        quantity: qty,
        brandId: product.brandId,
        brandIsExclusive: isExclusive,
        rule,
      });

      const brandExcess = Number(split.brandExcess);
      const merchantExcess = Number(split.merchantExcess);

      // brandEarning / merchantEarning stay INCLUSIVE of the excess (unchanged
      // behaviour) so every finance-summary and payout query that reads them is
      // unaffected; the *ExcessEarning columns are carve-out snapshots.
      brandEarning = +(baseLine * (rates.brandPct / 100) + brandExcess).toFixed(2);
      merchantEarning = +(baseLine * (rates.merchantPct / 100) + merchantExcess).toFixed(2);
      brandExcessEarning = brandExcess;
      merchantExcessEarning = merchantExcess;
      platformExcessEarning = Number(split.platformExcess);
      // Platform keeps its excess share plus the rounding remainder.
      platformEarning = +(total - brandEarning - merchantEarning).toFixed(2);
    } else {
      brandEarning = +(total * (rates.brandPct / 100)).toFixed(2);
      merchantEarning = +(total * (rates.merchantPct / 100)).toFixed(2);
      brandExcessEarning = 0;
      merchantExcessEarning = 0;
      platformExcessEarning = 0;
      platformEarning = +(total - brandEarning - merchantEarning).toFixed(2);
    }

    // Platform takes the rounding remainder; never go negative.
    if (platformEarning < 0) {
      console.warn(
        `[settlement] platform earning negative on order ${order.id} item ${item.id} ` +
          `(total ${total}, brand ${brandEarning}, merchant ${merchantEarning}); clamped to 0`,
      );
      platformEarning = 0;
    }

    if (rates.clamped) {
      console.warn(
        `[settlement] product ${product.id} rates exceed 100% (brand ${rates.brandPct} + merchant); merchant share clamped`,
      );
    }

    console.log(
      `[settlement] order ${order.id} item ${item.id}: brand ${rates.brandPct}% (${rates.brandSource}) ` +
        `merchant ${rates.merchantPct}% (${rates.merchantSource}) on ${total}` +
        (rule
          ? ` + ${scenario} excess split ` +
            `${split.pctApplied.brand}/${split.pctApplied.merchant}/${split.pctApplied.platform}` +
            ` = ${brandExcessEarning}/${merchantExcessEarning}/${platformExcessEarning}`
          : ""),
    );

    lines.push({
      item,
      product,
      unit,
      qty,
      total,
      brandEarning,
      merchantEarning,
      merchantExcessEarning,
      brandExcessEarning,
      platformExcessEarning,
      platformEarning,
      bonusScenario: rule ? scenario : null,
      brandPctApplied: rule ? split.pctApplied.brand : null,
      merchantPctApplied: rule ? split.pctApplied.merchant : null,
      platformPctApplied: rule ? split.pctApplied.platform : null,
      bonusRuleId: rule ? rule.id : null,
      // @deprecated column, kept equal to merchantPctApplied for continuity.
      excessPctApplied: rule ? split.pctApplied.merchant : null,
      thresholdApplied: rule ? rule.priceThreshold : null,
    });
  }

  if (lines.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const l of lines) {
      // 1) Upsert Sale (idempotent per orderItem)
      const sale = await tx.sale.upsert({
        where: { orderItemId: l.item.id }, // <-- UNIQUE on Sale.orderItemId
        create: {
          orderItemId: l.item.id,
          productId: l.product.id,
          merchantId: l.product.userId,
          brandId: l.product.brandId || null,
          quantity: l.qty,
          total: l.total,
          brandEarning: l.brandEarning,
          merchantEarning: l.merchantEarning,
          merchantExcessEarning: l.merchantExcessEarning,
          brandExcessEarning: l.brandExcessEarning,
          platformExcessEarning: l.platformExcessEarning,
          platformEarning: l.platformEarning,
          bonusScenario: l.bonusScenario,
          brandPctApplied: l.brandPctApplied,
          merchantPctApplied: l.merchantPctApplied,
          platformPctApplied: l.platformPctApplied,
          bonusRuleId: l.bonusRuleId,
          excessPctApplied: l.excessPctApplied,
          thresholdApplied: l.thresholdApplied,
        },
        // GUARD 2 — the row already exists, so these earnings are history.
        // Never overwrite them.
        update: {},
      });

      // 2) Upsert SaleItem linked to the Sale (also idempotent per orderItem)
      await tx.saleItem.upsert({
        where: { orderItemId: l.item.id },
        create: {
          orderItemId: l.item.id,
          saleId: sale.id,
          productId: l.product.id,
          quantity: l.qty,
          unitPrice: l.unit,
          total: l.total,
        },
        update: {},
      });
    }

    // GUARD 3 — stamp inside the same transaction as the Sale rows
    await tx.order.update({
      where: { id: order.id },
      data: { settledAt },
    });
  });
}
