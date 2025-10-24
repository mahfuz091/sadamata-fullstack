import { prisma } from "@/lib/prisma";
import { PayoutActor } from '@/generated/prisma';


// Helper: only count sales from paid orders
const paidSaleWhere = {
  orderItem: {
    order: { status: 'PAID' },
  },
};

// BRAND total income, withdrawals, and remaining balance
export async function getBrandFinancialSummary(brandId) {
  const [sales, payouts] = await Promise.all([
    prisma.sale.aggregate({
      where: { ...paidSaleWhere, brandId },
      _sum: { total: true, brandEarning: true },
    }),
    prisma.payout.aggregate({
      where: { actor: PayoutActor.BRAND, brandId },
      _sum: { amount: true },
    }),
  ]);

  const totalSell = sales._sum.total || 0;
  const brandTotalIncome = sales._sum.brandEarning || 0;
  const withdrawAmount = payouts._sum.amount || 0;
   const totalProductsSold = Number(sales._sum.quantity ?? 0);
  const totalAfterWithdraw = brandTotalIncome - withdrawAmount;

  return {
    brandId,
    totalSell,
    brandTotalIncome,
    withdrawAmount,
    totalAfterWithdraw,
    totalProductsSold
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

// Example usage
async function main() {
  const brandSummary = await getBrandFinancialSummary('BRAND_ID_HERE');
  const merchantSummary = await getMerchantFinancialSummary('MERCHANT_ID_HERE');
  const platformTotals = await getPlatformTotals();

  console.log('Brand Summary:', brandSummary);
  console.log('Merchant Summary:', merchantSummary);
  console.log('Platform Totals:', platformTotals);
}

main()
  .catch(console.error)
  .finally();
