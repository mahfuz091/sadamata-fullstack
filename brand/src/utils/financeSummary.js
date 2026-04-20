import { prisma } from "@/lib/prisma";
import { OrderStatus, PayoutActor, Prisma } from '@/generated/prisma';


// Helper: only count sales from paid orders
const paidSaleWhere = {
  orderItem: {
    order: {  status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },  },
  },
};

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

  const [orders, payoutsAgg] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: soldStatuses } },
      select: {
        items: {
          select: {
            productId: true,
            unitPrice: true,
            quantity: true,
          },
        },
      },
    }),
    prisma.payout.aggregate({
      where: { actor: PayoutActor.BRAND, brandId },
      _sum: { amount: true },
    }),
  ]);

  const productIds = Array.from(
    new Set(
      orders
        .flatMap((order) => order.items.map((item) => item.productId))
        .filter(Boolean)
    )
  );

  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds }, brandId },
        select: {
          id: true,
          brandCommissionPct: true,
          Brand: { select: { defaultBrandPct: true } },
        },
      })
    : [];

  const productMap = new Map(products.map((product) => [product.id, product]));
  let totalSell = new Prisma.Decimal(0);
  let brandTotalIncome = new Prisma.Decimal(0);
  let totalProductsSold = 0;

  for (const order of orders) {
    for (const item of order.items) {
      const product = item.productId ? productMap.get(item.productId) : null;
      if (!product) continue;

      const quantity = item.quantity || 0;
      const lineTotal = new Prisma.Decimal(item.unitPrice || 0).mul(quantity);
      const brandPct =
        product.brandCommissionPct ?? product.Brand?.defaultBrandPct ?? 0;

      totalSell = totalSell.add(lineTotal);
      brandTotalIncome = brandTotalIncome.add(lineTotal.mul(brandPct).div(100));
      totalProductsSold += quantity;
    }
  }

  const withdrawAmount = Number(payoutsAgg._sum.amount ?? 0);
  const brandTotalIncomeNumber = Number(brandTotalIncome);
  const totalAfterWithdraw = brandTotalIncomeNumber - withdrawAmount;

  return {
    brandId,
    totalSell: Number(totalSell),
    brandTotalIncome: brandTotalIncomeNumber,
    withdrawAmount,
    totalAfterWithdraw,
    totalProductsSold,
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

