import { prisma } from "@/lib/prisma";
import { OrderStatus, PayoutActor, Prisma } from '@/generated/prisma';


// Helper: only count sales from paid orders
const paidSaleWhere = {
  orderItem: {
    order: {  status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },  },
  },
};

/**
 * UTC window covering the running month in Dhaka time (+06:00).
 * Derived from `new Date()` on every call, so it rolls over on its own when the
 * month changes — nothing to configure or select.
 */
export function getDhakaMonthWindowUTC(date = new Date()) {
  const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000; // +06:00
  const d = new Date(date.getTime() + DHAKA_OFFSET_MS);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();

  const startUtcMs = Date.UTC(y, m, 1) - DHAKA_OFFSET_MS;
  const endUtcMs = Date.UTC(y, m + 1, 1) - DHAKA_OFFSET_MS; // exclusive

  return {
    startUTC: new Date(startUtcMs),
    endUTC: new Date(endUtcMs),
    monthStart: new Date(Date.UTC(y, m, 1)),
    monthEnd: new Date(Date.UTC(y, m + 1, 0)),
  };
}

// BRAND total income, withdrawals, and remaining balance
export async function getBrandFinancialSummary(brandId) {
  if (!brandId) {
    return {
      brandId,
      totalSell: 0,
      brandTotalIncome: 0,
      withdrawAmount: 0,
      totalAfterWithdraw: 0,
      totalProductsSold: 0,
    };
  }

  const soldStatuses = [
    OrderStatus.PAID,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
  ];

  // Read the recorded earnings off Sale instead of recomputing from
  // Product.brandCommissionPct. Settlement resolves the rate live at payment
  // time, so a rate change no longer matches the frozen product snapshot — and
  // recomputing here would silently restate what old orders already paid out.
  // ✅ running month window (Dhaka), recomputed on every request
  const { startUTC, endUTC, monthStart, monthEnd } = getDhakaMonthWindowUTC();

  const [salesAgg, payoutsAgg, monthAgg, monthRefundAgg] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        brandId,
        orderItem: { order: { status: { in: soldStatuses } } },
      },
      _sum: { total: true, brandEarning: true, quantity: true },
    }),
    prisma.payout.aggregate({
      where: { actor: PayoutActor.BRAND, brandId },
      _sum: { amount: true },
    }),
    prisma.sale.aggregate({
      where: {
        brandId,
        // CANCELLED / RETURNED / PENDING / FAILED orders are excluded here
        orderItem: { order: { status: { in: soldStatuses } } },
        createdAt: { gte: startUTC, lt: endUTC },
      },
      _sum: { total: true, brandEarning: true, quantity: true },
    }),
    // A returned item does NOT always flip the order status — refundOrderItem()
    // writes a Refund row and leaves the order PAID. Those have to be netted out
    // separately or the month total still counts money that went back.
    prisma.refund.aggregate({
      where: {
        sale: {
          brandId,
          createdAt: { gte: startUTC, lt: endUTC },
        },
      },
      _sum: { amount: true, brandEarning: true, quantity: true },
    }),
  ]);

  const totalSell = Number(salesAgg._sum.total ?? 0);
  const brandTotalIncome = Number(salesAgg._sum.brandEarning ?? 0);
  const totalProductsSold = Number(salesAgg._sum.quantity ?? 0);
  const withdrawAmount = Number(payoutsAgg._sum.amount ?? 0);

  return {
    brandId,
    totalSell,
    brandTotalIncome,
    withdrawAmount,
    totalAfterWithdraw: brandTotalIncome - withdrawAmount,
    totalProductsSold,

    // ✅ running-month figures (auto-rolls to the next month, no selection)
    //    net of cancelled/returned orders AND of refunds on still-PAID orders
    currentMonthSales:
      Number(monthAgg._sum.total ?? 0) - Number(monthRefundAgg._sum.amount ?? 0),
    currentMonthEarning:
      Number(monthAgg._sum.brandEarning ?? 0) -
      Number(monthRefundAgg._sum.brandEarning ?? 0),
    currentMonthUnits:
      Number(monthAgg._sum.quantity ?? 0) -
      Number(monthRefundAgg._sum.quantity ?? 0),

    // kept separate so the UI can show the deduction if it ever needs to
    currentMonthGrossSales: Number(monthAgg._sum.total ?? 0),
    currentMonthRefunded: Number(monthRefundAgg._sum.amount ?? 0),
    currentMonthStart: monthStart.toISOString(),
    currentMonthEnd: monthEnd.toISOString(),
  };
}
// MERCHANT total income, withdrawals, and remaining balance
// export async function getMerchantFinancialSummary(merchantId) {
//   const [sales, payouts, productSales] = await Promise.all([
//     prisma.sale.aggregate({
//       where: { ...paidSaleWhere, merchantId },
//       _sum: { total: true, merchantEarning: true },
//     }),
//     prisma.payout.aggregate({
//       where: { actor: PayoutActor.MERCHANT, merchantId },
//       _sum: { amount: true },
//     }),
//     prisma.saleItem.aggregate({
//       where: {
//         // NOTE: relation name must match your schema; error indicates it's "Sale"
//         Sale: {
//           merchantId,
//           ...paidSaleWhere, // ensure these fields belong to the Sale model
//         },
//       },
//       _sum: { quantity: true }, // top-level, not inside select
//     }),
//   ]);

//   const totalSell = sales._sum.total || 0;
//   const merchantTotalIncome = sales._sum.merchantEarning || 0;
//   const withdrawAmount = payouts._sum.amount || 0;
//   const totalAfterWithdraw = merchantTotalIncome - withdrawAmount;
//   const totalProductsSold = productSales._sum.quantity || 0;

//   return {
//     merchantId,
//     totalSell,
//     merchantTotalIncome,
//     withdrawAmount,
//     totalAfterWithdraw,
//     totalProductsSold,
//   };
// }

export async function getMerchantFinancialSummary(merchantId) {
  // 1️⃣ Get all paid order items
  const paidOrderItems = await prisma.orderItem.findMany({
    where: { order: { status: 'PAID' } },
    select: { id: true },
  });
  const paidOrderItemIds = paidOrderItems.map((x) => x.id);
                  
  // 2️⃣ Only match sales for this merchant + paid order items
  const saleWhere =
    paidOrderItemIds.length > 0
      ? { merchantId, orderItemId: { in: paidOrderItemIds } }
      : { merchantId, id: { in: [] } }; // no matches → 0 results

  // 3️⃣ Aggregate sales and payouts
  const [salesAgg, payoutsAgg] = await Promise.all([
    prisma.sale.aggregate({
      where: saleWhere,
      _sum: { total: true, merchantEarning: true, quantity: true },
    }),
    prisma.payout.aggregate({
      where: { actor: 'MERCHANT', merchantId },
      _sum: { amount: true },
    }),
  ]);

  console.log(salesAgg, payoutsAgg, "mahfuz");
  

  // 4️⃣ Compute final values
  const totalSell = Number(salesAgg._sum.total ?? 0);
  const merchantTotalIncome = Number(salesAgg._sum.merchantEarning ?? 0);
  const totalProductsSold = Number(salesAgg._sum.quantity ?? 0);
  const withdrawAmount = Number(payoutsAgg._sum.amount ?? 0);
  const totalAfterWithdraw = merchantTotalIncome - withdrawAmount;

  return {
    merchantId,
    totalSell,
    merchantTotalIncome,
    withdrawAmount,
    totalAfterWithdraw,
    totalProductsSold,
  };
}







// PLATFORM totals (optional)
export async function getPlatformTotals() {
  const sales = await prisma.sale.aggregate({
    where: paidSaleWhere,
    _sum: {
      total: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
  });

  return {
    totalSell: sales._sum.total || 0,
    brandTotal: sales._sum.brandEarning || 0,
    merchantTotal: sales._sum.merchantEarning || 0,
    platformTotal: sales._sum.platformEarning || 0,
  };
}

