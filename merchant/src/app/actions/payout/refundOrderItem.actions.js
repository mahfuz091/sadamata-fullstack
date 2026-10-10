// app/actions/refundOrderItem.js
'use server'

import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { requireSessionUser } from '@/lib/session'

// Reverse a sale, fully or proportionally. Pass `refundedQty` for a partial
// refund; omit it for a full one. One refund row per order item
// (Refund.orderItemId is unique), so a repeat call is idempotent.
export async function refundOrderItem(
  orderItemId,
  reason = 'RETURNED_OR_CANCELLED',
  refundedQty,
) {
  // Addressed only by order item id: the caller has to be the merchant who
  // made that sale.
  const user = await requireSessionUser()
  const ownSale = await prisma.sale.findFirst({
    where: { orderItemId, merchantId: user.id },
    select: { id: true },
  })
  if (!ownSale) throw new Error('Forbidden')

  return await prisma.$transaction(async (tx) => {
    // আগেই রিফান্ড হয়েছে কি না
    const existing = await tx.refund.findUnique({ where: { orderItemId } })
    if (existing) return existing // idempotent

    // যেটা বিক্রি হয়েছিল সেটা আনুন (Sale.orderItemId unique)
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
          merchantExcessReversed: 0,
          platformEarning: 0,
          reason,
        },
      })
    }

    const soldQty = sale.quantity || 0
    const qty = refundedQty == null ? soldQty : Number(refundedQty)
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error('refundedQty must be a positive number')
    }
    if (qty > soldQty) {
      throw new Error(`refundedQty cannot exceed the sold quantity (${soldQty})`)
    }

    // Reverse the ORIGINAL sale's recorded split proportionally — never the
    // currently active rule.
    const ratio = soldQty > 0 ? new Prisma.Decimal(String(qty)).div(String(soldQty)) : new Prisma.Decimal(0)
    const scale = (v) => new Prisma.Decimal(String(v ?? 0)).mul(ratio).toDecimalPlaces(2)

    return tx.refund.create({
      data: {
        orderItemId,
        saleId: sale.id,
        quantity: qty,
        amount: scale(sale.total),
        brandEarning: scale(sale.brandEarning),
        merchantEarning: scale(sale.merchantEarning),
        merchantExcessReversed: scale(sale.merchantExcessEarning),
        platformEarning: scale(sale.platformEarning),
        reason,
      },
    })
  })
}
