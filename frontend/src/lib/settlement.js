// lib/settlement.js
import prisma from "@/lib/prisma";
import { resolveCommissionAt } from "@/lib/commissionResolver";
import { resolveExcessSplit } from "@/lib/excessSplit";
import { getActiveBonusRule } from "@/lib/merchantTierRule";

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

  // Tiered merchant commission: one rule snapshot for the whole order.
  const bonusRule = await getActiveBonusRule();

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

    // Split the line into the base slice (up to the bonus-rule threshold) and
    // the above-threshold excess. The base keeps its existing resolution; the
    // excess gets its own split — FIXED (brand 60/40) for brand products, the
    // legacy excessPct for brand-less ones.
    //
    // Brand.isExclusive is read live at settlement time (resolveCommissionAt
    // returns it). Sale rows are written once and never repriced, so changing a
    // brand's exclusivity later cannot alter already-settled sales.
    const hasBrand = !!product.brandId;
    const isExclusive = !!rates.isExclusive;
    const isMerchOwned = product.User?.role === "MERCH";
    const rule =
      isMerchOwned &&
      bonusRule &&
      bonusRule.isActive !== false &&
      bonusRule.priceThreshold != null &&
      bonusRule.excessPct != null
        ? bonusRule
        : null;

    let brandEarning;
    let merchantEarning;
    let merchantExcessEarning;
    let platformEarning;
    let excessPctApplied = null;

    if (rule) {
      const threshold = Number(rule.priceThreshold);
      const baseLine = Math.min(unit, threshold) * qty;
      const excessLine = Math.max(unit - threshold, 0) * qty;
      const split = resolveExcessSplit({
        hasBrand,
        isExclusive,
        excessPctRule: Number(rule.excessPct),
      });

      const brandBase = +(baseLine * (rates.brandPct / 100)).toFixed(2);
      const brandExcess = +(excessLine * (split.brand / 100)).toFixed(2);
      const merchantBase = +(baseLine * (rates.merchantPct / 100)).toFixed(2);
      const merchantExcess = +(excessLine * (split.merchant / 100)).toFixed(2);

      brandEarning = +(brandBase + brandExcess).toFixed(2);
      // merchantEarning stays inclusive of the excess so reports that derive
      // base as (merchantEarning - merchantExcessEarning) keep working.
      merchantEarning = +(merchantBase + merchantExcess).toFixed(2);
      merchantExcessEarning = merchantExcess;
      platformEarning = +(total - brandEarning - merchantEarning).toFixed(2);
      excessPctApplied = split.merchant;
    } else {
      brandEarning = +(total * (rates.brandPct / 100)).toFixed(2);
      merchantEarning = +(total * (rates.merchantPct / 100)).toFixed(2);
      merchantExcessEarning = 0;
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
          ? ` + excess ${excessPctApplied}% = ${merchantExcessEarning}` +
            (hasBrand
              ? ` (brand excess ${isExclusive ? "exclusive" : "non-exclusive"})`
              : "")
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
      platformEarning,
      bonusRuleId: rule ? rule.id : null,
      excessPctApplied,
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
          platformEarning: l.platformEarning,
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
