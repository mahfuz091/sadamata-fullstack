// lib/settlement.js
import prisma from "@/lib/prisma";

function resolveRates(product, brand) {
  const brandPct =
    typeof product.brandCommissionPct === "number"
      ? product.brandCommissionPct
      : brand ? brand.defaultBrandPct : 0;

  const merchantPct =
    typeof product.merchantCommissionPct === "number"
      ? product.merchantCommissionPct
      : brand ? brand.defaultMerchantPct : 0;

  const platformPct = Math.max(0, 100 - (brandPct + merchantPct));
  return { brandPct, merchantPct, platformPct };
}

export async function settleOrderEarnings(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });
  if (!order) throw new Error("Order not found");

  const productIds = order.items.map(i => i.productId).filter(Boolean);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      Brand: true,
      User: { select: { id: true } },
    },
  });
  const productMap = new Map(products.map(p => [p.id, p]));

  const actions = order.items.map((item) => {
    if (!item.productId) return null; // skip lines without productId
    const product = productMap.get(item.productId);
    if (!product) return null;

    const brand = product.Brand || null;
    const merchantId = product.userId;      // product owner = merchant
    const brandId = product.brandId || null;

    const unit = Number(item.unitPrice);    // Decimal -> number
    const qty = item.quantity;
    const total = unit * qty;

    const { brandPct, merchantPct, platformPct } = resolveRates(product, brand);
    const brandEarning    = +(total * (brandPct / 100)).toFixed(2);
    const merchantEarning = +(total * (merchantPct / 100)).toFixed(2);
    const platformEarning = +(total * (platformPct / 100)).toFixed(2);

    // 🔑 HOTFIX: use Sale.id = OrderItem.id for idempotency
    return prisma.sale.upsert({
  where: { orderItemId: item.id },      // unique key
  create: {
    orderItemId: item.id,               // <-- REQUIRED (non-null)
    productId: product.id,
    merchantId,
    brandId,
    quantity: qty,
    total,
    brandEarning,
    merchantEarning,
    platformEarning,
  },
  update: {
    quantity: qty,
    total,
    brandEarning,
    merchantEarning,
    platformEarning,
  },
});

  }).filter(Boolean);

  await prisma.$transaction(actions);
}
