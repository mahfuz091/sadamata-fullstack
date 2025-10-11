'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'

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

/**
 * আজকের রিপোর্ট (লগইন মার্চেন্টের জন্য)
 * includes:
 *   soldUnits, canceledOrders, refundedUnits,
 *   grossRevenue, brandRoyalty, merchantRoyalty, platformEarning
 */
export async function getTodayMerchantSalesReportFromOrders(merchantId) {
  if (!merchantId) throw new Error('merchantId required')

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
      if (!p || p.userId !== merchantId) continue
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
    merchantId,
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
