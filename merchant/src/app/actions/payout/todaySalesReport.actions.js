'use server';

import { prisma } from '@/lib/prisma';

// Asia/Dhaka (+06:00) দিনের উইন্ডোকে UTC-তে কনভার্ট করে আনা
function getDhakaDayWindowUTC(date = new Date()) {
  const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000; // +06:00
  const nowDhakaMs = date.getTime() + DHAKA_OFFSET_MS;
  const d = new Date(nowDhakaMs);

  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();

  const startUtcMs = Date.UTC(y, m, day) - DHAKA_OFFSET_MS;
  const endUtcMs = startUtcMs + 24 * 60 * 60 * 1000;

  return { startUTC: new Date(startUtcMs), endUTC: new Date(endUtcMs), y, m, day };
}

export async function getTodaySalesReport() {
  const { startUTC, endUTC, y, m, day } = getDhakaDayWindowUTC();

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: startUTC, lt: endUTC } },
    select: {
      quantity: true,
      total: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
  });

  const cancelledOrders = await prisma.order.count({
    where: { status: 'CANCELLED', createdAt: { gte: startUTC, lt: endUTC } },
  });

  let soldUnits = 0;
  let grossRevenue = 0;
  let royaltyTotal = 0;
  let platformEarning = 0;

  for (const s of sales) {
    soldUnits += s.quantity || 0;
    grossRevenue += Number(s.total || 0);
    royaltyTotal += Number((s.brandEarning || 0) + (s.merchantEarning || 0));
    platformEarning += Number(s.platformEarning || 0);
  }

  const returnedCount = 0; // আপনার স্কিমায় রিটার্ন টেবিল নেই—প্রয়োজনে ভবিষ্যতে যুক্ত করুন

  return {
    dateLabel: `${String(m + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${String(y).slice(-2)}`,
    totals: {
      grossRevenue,
      royalties: royaltyTotal,
      platformEarning,
    },
    counts: {
      sold: soldUnits,
      cancelled: cancelledOrders,
      returned: returnedCount,
    },
  };
}
