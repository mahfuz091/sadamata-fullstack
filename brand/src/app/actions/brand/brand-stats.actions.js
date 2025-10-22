'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'

/**
 * ইউজারের ১ম ব্র্যান্ডের স্ট্যাটস (createdAt ASC অনুযায়ী প্রথম Brand)
 * @param {string} userId
 * @param {object} opts  - { useVisibility?: boolean, timeFrom?: Date, timeTo?: Date }
 */

/** আজকের Dhaka টাইম অনুযায়ী UTC উইন্ডো বের করে */
function getDhakaDayWindowUTC(date = new Date()) {
  const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000 // +06:00
  const nowDhakaMs = date.getTime() + DHAKA_OFFSET_MS
  const d = new Date(nowDhakaMs)
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth()
  const day = d.getUTCDate()
  const startUtcMs = Date.UTC(y, m, day) - DHAKA_OFFSET_MS
  const endUtcMs = startUtcMs + 24 * 60 * 60 * 1000
  return { startUTC: new Date(startUtcMs), endUTC: new Date(endUtcMs) }
}
export async function getUserFirstBrandStats(userId, opts = {}) {
  if (!userId) throw new Error('userId required')

  const { useVisibility = false, timeFrom, timeTo } = opts

  // ০) ইউজারের ১ম ব্র্যান্ড খুঁজে বের করা
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

  // ১) মোট প্রোডাক্ট
  const totalProducts = await prisma.product.count({
    where: { brandId },
  })

  // ২) live প্রোডাক্ট
  const liveWhere = useVisibility
    ? { brandId, isActive: true, visibility: true }
    : { brandId, isActive: true }

  const totalLiveProducts = await prisma.product.count({
    where: liveWhere,
  })

  // ৩) সেল আছে এমন প্রোডাক্ট (ডিস্টিংক্ট productId)
  const saleWhere = {
    brandId,
    ...(timeFrom && timeTo ? { createdAt: { gte: timeFrom, lte: timeTo } } : {}),
  }

  const soldProductIds = await prisma.sale.findMany({
    where: saleWhere,
    select: { productId: true },
    distinct: ['productId'],
  })

  const totalProductsWithSales = soldProductIds.length

  // ৪) সেল সামারি (quantity, revenue, earning)
  const salesAgg = await prisma.sale.groupBy({
    by: ['brandId'],
    where: saleWhere,
    _count: { _all: true },
    _sum: {
      quantity: true,
      total: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
  })

  const summary = salesAgg[0] || {
    _count: { _all: 0 },
    _sum: {
      quantity: 0,
      total: 0,
      brandEarning: 0,
      merchantEarning: 0,
      platformEarning: 0,
    },
  }

  return {
    userId,
    brandFound: true,
    brandId,
    brandName,
    totalProducts,
    totalLiveProducts,
    totalProductsWithSales,
    salesSummary: {
      salesCount: summary._count._all,
      totalQuantity: Number(summary._sum.quantity || 0),
      totalRevenue: Number(summary._sum.total || 0),
      brandEarning: Number(summary._sum.brandEarning || 0),
      merchantEarning: Number(summary._sum.merchantEarning || 0),
      platformEarning: Number(summary._sum.platformEarning || 0),
    },
  }
}

export async function getTodayUploadedProductsForFirstBrand(userId) {
  if (!userId) throw new Error('userId is required')

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

  // Dhaka timezone = UTC +6
  const now = new Date()
  const dhakaOffset = 6 * 60 * 60 * 1000
  const nowDhaka = new Date(now.getTime() + dhakaOffset)

  const startDhaka = new Date(Date.UTC(nowDhaka.getUTCFullYear(), nowDhaka.getUTCMonth(), nowDhaka.getUTCDate(), 0, 0, 0))
  const endDhaka = new Date(Date.UTC(nowDhaka.getUTCFullYear(), nowDhaka.getUTCMonth(), nowDhaka.getUTCDate(), 23, 59, 59))

  // Convert back to UTC
  const startUTC = new Date(startDhaka.getTime() - dhakaOffset)
  const endUTC = new Date(endDhaka.getTime() - dhakaOffset)

  const products = await prisma.product.findMany({
    where: {
      brandId,
      createdAt: { gte: startUTC, lte: endUTC },
    },
    select: { id: true, title: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return {
    userId,
    brandFound: true,
    brandId,
    brandName,
    totalTodayUploaded: products.length,
    products,
  }
}

export async function getTodayBrandSalesReportFromOrders(userId) {
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
  const { startUTC, endUTC } = getDhakaDayWindowUTC()

  // === ১️⃣ আজকের "PAID" অর্ডার ===
  const paidOrders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      OR: [
        { settledAt: { gte: startUTC, lt: endUTC } },
        { AND: [{ settledAt: null }, { createdAt: { gte: startUTC, lt: endUTC } }] },
      ],
    },
    select: {
      id: true,
      items: { select: { id: true, productId: true, unitPrice: true, quantity: true } },
    },
  })

  // === ২️⃣ আজকের "CANCELLED" অর্ডার ===
  const cancelledOrders = await prisma.order.findMany({
    where: { status: 'CANCELLED', createdAt: { gte: startUTC, lt: endUTC } },
    select: { id: true, items: { select: { productId: true } } },
  })

  // === ৩️⃣ আজকের Refund ===
  const refunds = await prisma.refund.findMany({
    where: { createdAt: { gte: startUTC, lt: endUTC } },
    select: {
      id: true,
      orderItemId: true,
      amount: true,
      quantity: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
      orderItem: { select: { productId: true } },
    },
  })

  // === প্রোডাক্ট ইনফো ===
  const productIds = Array.from(
    new Set([
      ...paidOrders.flatMap(o => o.items.map(i => i.productId)).filter(Boolean),
      ...cancelledOrders.flatMap(o => o.items.map(i => i.productId)).filter(Boolean),
      ...refunds.map(r => r.orderItem.productId).filter(Boolean),
    ])
  )

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      userId: true, // merchantId
      brandId: true,
      brandCommissionPct: true,
      merchantCommissionPct: true,
      Brand: { select: { defaultBrandPct: true, defaultMerchantPct: true } },
    },
  })

  const pmap = new Map(products.map(p => [p.id, p]))

  // === SOLD হিসাব ===
  let soldUnits = 0
  let soldOrders = 0
  let grossRevenue = new Prisma.Decimal(0)
  let brandRoyalty = new Prisma.Decimal(0)
  let merchantRoyalty = new Prisma.Decimal(0)
  let platformEarning = new Prisma.Decimal(0)

  for (const order of paidOrders) {
    let hasThisMerchantItem = false
    for (const item of order.items) {
      const p = pmap.get(item.productId)
      if (!p || p.brandId !== brandId) continue
      hasThisMerchantItem = true

      const qty = item.quantity ?? 0
      const price = new Prisma.Decimal(item.unitPrice ?? 0)
      const total = price.mul(qty)

      const brandPct =
        p.brandCommissionPct ??
        (p.brandId ? p.Brand?.defaultBrandPct ?? 0 : 0)
      const merchPct =
        p.merchantCommissionPct ??
        (p.brandId ? p.Brand?.defaultMerchantPct ?? 0 : 0)

      const brandAmt = total.mul(brandPct).div(100)
      const merchAmt = total.mul(merchPct).div(100)
      const platformAmt = total.sub(brandAmt).sub(merchAmt)

      soldUnits += qty
      grossRevenue = grossRevenue.add(total)
      brandRoyalty = brandRoyalty.add(brandAmt)
      merchantRoyalty = merchantRoyalty.add(merchAmt)
      platformEarning = platformEarning.add(platformAmt)
    }
    if (hasThisMerchantItem) soldOrders++
  }

  // === CANCELLED হিসাব ===
  let canceledOrders = 0
  for (const order of cancelledOrders) {
    const hasThisMerchant = order.items.some(it => {
      const p = pmap.get(it.productId)
      return p && p.userId === merchantId
    })
    if (hasThisMerchant) canceledOrders++
  }

  // === REFUND হিসাব ===
  let refundedUnits = 0
  let refundTotal = new Prisma.Decimal(0)
  let refundBrandCut = new Prisma.Decimal(0)
  let refundMerchantCut = new Prisma.Decimal(0)
  let refundPlatformCut = new Prisma.Decimal(0)

  for (const r of refunds) {
    const productId = r.orderItem.productId
    const p = pmap.get(productId)
    if (!p || p.userId !== merchantId) continue

    refundedUnits += r.quantity
    refundTotal = refundTotal.add(r.amount)
    refundBrandCut = refundBrandCut.add(r.brandEarning)
    refundMerchantCut = refundMerchantCut.add(r.merchantEarning)
    refundPlatformCut = refundPlatformCut.add(r.platformEarning)
  }

  // === নেট বিক্রি হিসাব (রিটার্ন বাদে) ===
  const netUnits = soldUnits - refundedUnits
  const netRevenue = grossRevenue.sub(refundTotal)
  const netBrandRoyalty = brandRoyalty.sub(refundBrandCut)
  const netMerchantRoyalty = merchantRoyalty.sub(refundMerchantCut)
  const netPlatformEarning = platformEarning.sub(refundPlatformCut)

  return {
    brandId,
    brandName,
    soldUnits: Number(soldUnits),
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
    // নেট ভ্যালু
    netUnits: Number(netUnits),
    netRevenue: Number(netRevenue),
    netBrandRoyalty: Number(netBrandRoyalty),
    netMerchantRoyalty: Number(netMerchantRoyalty),
    netPlatformEarning: Number(netPlatformEarning),
  }
}

export async function getUserProductStats(userId, opts = {}) {
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

  const { useVisibility = false, timeFrom, timeTo } = opts;

  // 1) total products
  const totalProducts = await prisma.product.count({
    where: { brandId: brandId },
  });

  // 2) total live products
  const liveWhere = useVisibility
    ? { brandId: brandId, isActive: true, visibility: true }
    : { brandId: brandId, isActive: true };

  const totalLiveProducts = await prisma.product.count({
    where: liveWhere,
  });

  // 3) total products that have sales (ডিস্টিংক্ট productId)
  // Sale-এ merchantId আছে, তাই সরাসরি ব্যবহার করা যায়।
  const saleWhere = {
    brandId,
    ...(timeFrom && timeTo
      ? { createdAt: { gte: timeFrom, lte: timeTo } }
      : {}),
  };

  // PostgreSQL-এ findMany + distinct কাজ করে।
  const soldProductIds = await prisma.sale.findMany({
    where: saleWhere,
    select: { productId: true },
    distinct: ['productId'],
  });

  const totalProductsWithSales = soldProductIds.length;

  return {
    brandId,
    totalProducts,
    totalLiveProducts,
    totalProductsWithSales,
  };
}

export async function getTodayUploadedProducts(userId) {
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
  // Dhaka timezone = UTC +6
  const now = new Date();
  const dhakaOffset = 6 * 60 * 60 * 1000;
  const nowDhaka = new Date(now.getTime() + dhakaOffset);

  const startDhaka = new Date(Date.UTC(nowDhaka.getUTCFullYear(), nowDhaka.getUTCMonth(), nowDhaka.getUTCDate(), 0, 0, 0));
  const endDhaka = new Date(Date.UTC(nowDhaka.getUTCFullYear(), nowDhaka.getUTCMonth(), nowDhaka.getUTCDate(), 23, 59, 59));

  // Convert back to UTC for query
  const startUTC = new Date(startDhaka.getTime() - dhakaOffset);
  const endUTC = new Date(endDhaka.getTime() - dhakaOffset);

  const products = await prisma.product.findMany({
    where: {
      brandId: brandId,
      createdAt: {
        gte: startUTC,
        lte: endUTC,
      },
    },
    select: {
      id: true,
      title: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalTodayUploaded = products.length;

  return {
    brandId,
    brandName,
    totalTodayUploaded,
    products,
  };
}

