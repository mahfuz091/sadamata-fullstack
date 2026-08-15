// lib/settlement.js
import prisma from "@/lib/prisma";
import { resolveCommissionAt } from "@/lib/commissionResolver";

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
    },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

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

    const brandEarning = +(total * (rates.brandPct / 100)).toFixed(2);
    const merchantEarning = +(total * (rates.merchantPct / 100)).toFixed(2);
    // remainder, not total * platformPct — keeps the three buckets summing to total
    const platformEarning = +(total - brandEarning - merchantEarning).toFixed(2);

    if (rates.clamped) {
      console.warn(
        `[settlement] product ${product.id} rates exceed 100% (brand ${rates.brandPct} + merchant); merchant share clamped`,
      );
    }

    console.log(
      `[settlement] order ${order.id} item ${item.id}: brand ${rates.brandPct}% (${rates.brandSource}) ` +
        `merchant ${rates.merchantPct}% (${rates.merchantSource}) on ${total}`,
    );

    lines.push({
      item,
      product,
      unit,
      qty,
      total,
      brandEarning,
      merchantEarning,
      platformEarning,
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
          platformEarning: l.platformEarning,
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
