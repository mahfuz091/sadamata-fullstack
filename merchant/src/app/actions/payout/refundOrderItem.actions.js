// app/actions/refundOrderItem.js
'use server'

import { prisma } from '@/lib/prisma'

// পূর্ণ রিটার্ন; আংশিক হলে proportion হিসাব করে দিন
export async function refundOrderItem(orderItemId, reason = 'RETURNED_OR_CANCELLED') {
  return await prisma.$transaction(async (tx) => {
    // আগেই রিফান্ড হয়েছে কি না
    const existing = await tx.refund.findUnique({ where: { orderItemId } })
    if (existing) return existing // idempotent

    // যেটা বিক্রি হয়েছিল সেটা আনুন (Sale.orderItemId unique)
    const sale = await tx.sale.findUnique({ where: { orderItemId } })
    if (!sale) {
      // সেল না থাকলে, তাও আমরা রিফান্ড রেকর্ড বানাবো amount/earning=0 রেখে
      return tx.refund.create({
        data: {
          orderItemId,
          quantity: 0,
          amount: 0,
          brandEarning: 0,
          merchantEarning: 0,
          platformEarning: 0,
          reason,
        },
      })
    }

    // সংশ্লিষ্ট orderItem আনুন, UI/লগের জন্য (ঐচ্ছিক)
    const oi = await tx.orderItem.findUnique({ where: { id: orderItemId } })

    // পুরোটা রিটার্ন হিসাবে ধরলাম; আংশিক হলে এখানে ভাগ করে নিন
    return tx.refund.create({
      data: {
        orderItemId,
        saleId: sale.id,
        quantity: sale.quantity,
        amount: sale.total,                 // total refund amount
        brandEarning: sale.brandEarning,    // যে পরিমাণ কাটা হবে
        merchantEarning: sale.merchantEarning,
        platformEarning: sale.platformEarning,
        reason,
      },
    })
  })
}


// উদাহরণ: আজকের নেট রয়্যালটি
const sales = await prisma.sale.aggregate({
  where: { createdAt: { gte: startUTC, lt: endUTC } },
  _sum: { brandEarning: true, merchantEarning: true }
})

const refunds = await prisma.refund.aggregate({
  where: { createdAt: { gte: startUTC, lt: endUTC } },
  _sum: { brandEarning: true, merchantEarning: true }
})

const netBrandRoyalty    = (sales._sum.brandEarning ?? 0) - (refunds._sum.brandEarning ?? 0)
const netMerchantRoyalty = (sales._sum.merchantEarning ?? 0) - (refunds._sum.merchantEarning ?? 0)
