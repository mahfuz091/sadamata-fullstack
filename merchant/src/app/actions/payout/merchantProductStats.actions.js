'use server';

import { prisma } from '@/lib/prisma';

/**
 * মার্চেন্ট প্রোডাক্ট স্ট্যাটস
 * @param {string} merchantId  - User.id (merchant)
 * @param {object} opts        - ঐচ্ছিক: { useVisibility: boolean, timeFrom?: Date, timeTo?: Date }
 *   - useVisibility: true হলে live মানে isActive && visibility; না হলে শুধু isActive
 *   - timeFrom/timeTo দিলে "products that have sales" রেঞ্জ-ভিত্তিক গণনা হবে (Sale.createdAt)
 */
export async function getMerchantProductStats(merchantId, opts = {}) {
  if (!merchantId) throw new Error('merchantId required');

  const { useVisibility = false, timeFrom, timeTo } = opts;

  // 1) total products
  const totalProducts = await prisma.product.count({
    where: { userId: merchantId },
  });

  // 2) total live products
  const liveWhere = useVisibility
    ? { userId: merchantId, isActive: true, visibility: true }
    : { userId: merchantId, isActive: true };

  const totalLiveProducts = await prisma.product.count({
    where: liveWhere,
  });

  // 3) total products that have sales (ডিস্টিংক্ট productId)
  // Sale-এ merchantId আছে, তাই সরাসরি ব্যবহার করা যায়।
  const saleWhere = {
    merchantId,
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
    merchantId,
    totalProducts,
    totalLiveProducts,
    totalProductsWithSales,
  };
}

export async function getTodayUploadedProducts(merchantId) {
  if (!merchantId) throw new Error('merchantId is required');

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
      userId: merchantId,
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
    merchantId,
    totalTodayUploaded,
    products,
  };
}
