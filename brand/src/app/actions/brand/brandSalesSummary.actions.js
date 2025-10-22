'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

/** ---------- Time helpers (Asia/Dhaka) ---------- */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

function dhakaNow(date = new Date()) {
  return new Date(date.getTime() + DHAKA_OFFSET_MS);
}
function dhakaDayStart(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
}
function dhakaDayEnd(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
}
function toUTCFromDhaka(d) {
  return new Date(d.getTime() - DHAKA_OFFSET_MS);
}

/** Returns { startUTC, endUTC, label } for a named period */
function getRange(period, now = new Date()) {
  const nowDhaka = dhakaNow(now);

  if (period === 'yesterday') {
    const y = new Date(nowDhaka.getTime() - 1 * 24 * 60 * 60 * 1000);
    const startUTC = toUTCFromDhaka(dhakaDayStart(y));
    const endUTC = toUTCFromDhaka(dhakaDayEnd(y));
    const label = fmtRangeLabel(startUTC, endUTC);
    return { startUTC, endUTC, label };
  }

  if (period === 'last7') {
    // last 7 days including today: [start of (today-6), end of today]
    const startBase = new Date(nowDhaka.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startUTC = toUTCFromDhaka(dhakaDayStart(startBase));
    const endUTC = toUTCFromDhaka(dhakaDayEnd(nowDhaka));
    const label = fmtRangeLabel(startUTC, endUTC);
    return { startUTC, endUTC, label };
  }

  if (period === 'thisMonth') {
    const startDhaka = new Date(Date.UTC(nowDhaka.getUTCFullYear(), nowDhaka.getUTCMonth(), 1, 0, 0, 0));
    const endDhaka = dhakaDayEnd(nowDhaka);
    const startUTC = toUTCFromDhaka(startDhaka);
    const endUTC = toUTCFromDhaka(endDhaka);
    const label = fmtMonthLabel(nowDhaka);
    return { startUTC, endUTC, label };
  }

  if (period === 'prevMonth') {
    const y = nowDhaka.getUTCFullYear();
    const m = nowDhaka.getUTCMonth();
    const startDhaka = new Date(Date.UTC(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, 1, 0, 0, 0));
    const endDhaka = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)); // day 0 = last day of prev month
    const startUTC = toUTCFromDhaka(startDhaka);
    const endUTC = toUTCFromDhaka(endDhaka);
    const label = fmtMonthLabel(startDhaka);
    return { startUTC, endUTC, label };
  }

  if (period === 'allTime') {
    return {
      startUTC: new Date('1970-01-01T00:00:00.000Z'),
      endUTC: new Date('2999-12-31T23:59:59.999Z'),
      label: 'All Time',
    };
  }

  // default: today
  const startUTC = toUTCFromDhaka(dhakaDayStart(nowDhaka));
  const endUTC = toUTCFromDhaka(dhakaDayEnd(nowDhaka));
  const label = fmtRangeLabel(startUTC, endUTC);
  return { startUTC, endUTC, label };
}

function fmtRangeLabel(startUTC, endUTC) {
  // Label as M/D–M/D (Dhaka)
  const s = new Date(startUTC.getTime() + DHAKA_OFFSET_MS);
  const e = new Date(endUTC.getTime() + DHAKA_OFFSET_MS);
  return `${s.getUTCMonth() + 1}/${s.getUTCDate()}–${e.getUTCMonth() + 1}/${e.getUTCDate()}`;
}
function fmtMonthLabel(dDhaka) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[dDhaka.getUTCMonth()]} ${dDhaka.getUTCFullYear()}`;
}

/** ---------- Core aggregation for a range ---------- */
async function calcMerchantTotalsForRange(userId, startUTC, endUTC) {
  if (!userId) throw new Error('userId required')
const firstBrand = await prisma.brand.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true },
  })

  if (!firstBrand) {
    return {
      userId,
      brandFound: false,
      message: 'No brand found for this user',
    }
  }

  const { id: brandId, name: brandName } = firstBrand
  // 1) PAID orders in range (prefer settledAt, else createdAt)
  const paidOrders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      OR: [
        { settledAt: { gte: startUTC, lte: endUTC } },
        { AND: [{ settledAt: null }, { createdAt: { gte: startUTC, lte: endUTC } }] },
      ],
    },
    select: {
      id: true,
      items: { select: { id: true, productId: true, unitPrice: true, quantity: true } },
    },
  });

  // 2) CANCELLED orders in range (by createdAt)
  const cancelledOrders = await prisma.order.findMany({
    where: { status: 'CANCELLED', createdAt: { gte: startUTC, lte: endUTC } },
    select: { id: true, items: { select: { productId: true } } },
  });

  // 3) REFUNDS in range (by createdAt)
  const refunds = await prisma.refund.findMany({
    where: { createdAt: { gte: startUTC, lte: endUTC } },
    select: {
      id: true,
      quantity: true,
      amount: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
      orderItem: { select: { productId: true } },
    },
  });

  // Product set we must inspect for ownership
  const productIds = Array.from(
    new Set([
      ...paidOrders.flatMap(o => o.items.map(i => i.productId)).filter(Boolean),
      ...cancelledOrders.flatMap(o => o.items.map(i => i.productId)).filter(Boolean),
      ...refunds.map(r => r.orderItem.productId).filter(Boolean),
    ])
  );

  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          userId: true, // owner (merchant)
          brandId: true,
          brandCommissionPct: true,
          merchantCommissionPct: true,
          Brand: { select: { defaultBrandPct: true, defaultMerchantPct: true } },
        },
      })
    : [];

  const pmap = new Map(products.map(p => [p.id, p]));

  // === SOLD aggregation ===
  let soldUnits = 0;
  let soldOrders = 0;
  let grossRevenue = new Prisma.Decimal(0);
  let brandRoyalty = new Prisma.Decimal(0);
  let merchantRoyalty = new Prisma.Decimal(0);
  let platformEarning = new Prisma.Decimal(0);

  for (const order of paidOrders) {
    let hasThisMerchantItem = false;
    for (const item of order.items) {
      const p = item.productId ? pmap.get(item.productId) : null;
      if (!p || p.brandId !== brandId) continue;

      hasThisMerchantItem = true;

      const qty = item.quantity ?? 0;
      const price = new Prisma.Decimal(item.unitPrice ?? 0);
      const total = price.mul(qty);

      const brandPct =
        p.brandCommissionPct ??
        (p.brandId ? p.Brand?.defaultBrandPct ?? 0 : 0);
      const merchPct =
        p.merchantCommissionPct ??
        (p.brandId ? p.Brand?.defaultMerchantPct ?? 0 : 0);

      const brandAmt = total.mul(brandPct).div(100);
      const merchAmt = total.mul(merchPct).div(100);
      const platformAmt = total.sub(brandAmt).sub(merchAmt);

      soldUnits += qty;
      grossRevenue = grossRevenue.add(total);
      brandRoyalty = brandRoyalty.add(brandAmt);
      merchantRoyalty = merchantRoyalty.add(merchAmt);
      platformEarning = platformEarning.add(platformAmt);
    }
    if (hasThisMerchantItem) soldOrders++;
  }

  // === CANCELLED aggregation (count only per order) ===
  let canceledOrders = 0;
  for (const order of cancelledOrders) {
    const hit = order.items.some(it => {
      const p = it.productId ? pmap.get(it.productId) : null;
      return p && p.brandId === brandId;
    });
    if (hit) canceledOrders++;
  }

  // === REFUNDS aggregation ===
  let refundedUnits = 0;
  let refundTotal = new Prisma.Decimal(0);
  let refundBrandCut = new Prisma.Decimal(0);
  let refundMerchantCut = new Prisma.Decimal(0);
  let refundPlatformCut = new Prisma.Decimal(0);

  for (const r of refunds) {
    const p = r.orderItem?.productId ? pmap.get(r.orderItem.productId) : null;
    if (!p || p.brandId !== brandId) continue;

    refundedUnits += r.quantity ?? 0;
    refundTotal = refundTotal.add(r.amount ?? 0);
    refundBrandCut = refundBrandCut.add(r.brandEarning ?? 0);
    refundMerchantCut = refundMerchantCut.add(r.merchantEarning ?? 0);
    refundPlatformCut = refundPlatformCut.add(r.platformEarning ?? 0);
  }

  // === Net after refunds ===
  const netUnits = soldUnits - refundedUnits;
  const netRevenue = grossRevenue.sub(refundTotal);
  const netBrandRoyalty = brandRoyalty.sub(refundBrandCut);
  const netMerchantRoyalty = merchantRoyalty.sub(refundMerchantCut);
  const netPlatformEarning = platformEarning.sub(refundPlatformCut);

  return {
    soldUnits,
    soldOrders,
    canceledOrders,
    refundedUnits,
    grossRevenue: Number(grossRevenue),
    brandRoyalty: Number(brandRoyalty),
    merchantRoyalty: Number(merchantRoyalty),
    platformEarning: Number(platformEarning),

    refundTotal: Number(refundTotal),
    refundBrandCut: Number(refundBrandCut),
    refundMerchantCut: Number(refundMerchantCut),
    refundPlatformCut: Number(refundPlatformCut),

    netUnits,
    netRevenue: Number(netRevenue),
    netBrandRoyalty: Number(netBrandRoyalty),
    netMerchantRoyalty: Number(netMerchantRoyalty),
    netPlatformEarning: Number(netPlatformEarning),
  };
}

/** ---------- Public action: all sections together ---------- */
export async function getBrandSalesSummary(merchantId) {
  if (!merchantId) throw new Error('merchantId required');

  const periods = [
    ['yesterday', 'Yesterday'],
    ['last7', 'Last 7 Days'],
    ['thisMonth', 'This Month'],
    ['prevMonth', 'Previous Month'],
    ['allTime', 'All Time'],
  ];

  const results = {};
  for (const [key, title] of periods) {
    const { startUTC, endUTC, label } = getRange(key);
    const totals = await calcMerchantTotalsForRange(merchantId, startUTC, endUTC);
    results[key] = { title, label, ...totals };
  }
  return results;
}
