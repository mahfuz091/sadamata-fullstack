"use server";

import { prisma } from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";

// ======== Time helpers (Dhaka-aligned, UTC+6) ========
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

function nowDhaka() {
  const now = new Date();
  return new Date(now.getTime() + DHAKA_OFFSET_MS);
}

function startOfDhakaDay(d) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)
  );
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toUTC(dateInDhakaLocalMidnight) {
  return new Date(dateInDhakaLocalMidnight.getTime() - DHAKA_OFFSET_MS);
}

function buildDhakaRanges() {
  const nowD = nowDhaka();
  const todayStartDhaka = startOfDhakaDay(nowD);
  const tomorrowStartDhaka = addDays(todayStartDhaka, 1);

  const last7StartDhaka = addDays(todayStartDhaka, -6);
  const last30StartDhaka = addDays(todayStartDhaka, -29);
  const last90StartDhaka = addDays(todayStartDhaka, -89);

  return {
    today: {
      startUTC: toUTC(todayStartDhaka),
      endUTC: toUTC(tomorrowStartDhaka),
    },
    last7d: {
      startUTC: toUTC(last7StartDhaka),
      endUTC: toUTC(tomorrowStartDhaka),
    },
    last30d: {
      startUTC: toUTC(last30StartDhaka),
      endUTC: toUTC(tomorrowStartDhaka),
    },
    last90d: {
      startUTC: toUTC(last90StartDhaka),
      endUTC: toUTC(tomorrowStartDhaka),
    },
  };
}

// ======== Core query helper ========

/**
 * এক রেঞ্জে merchantId অনুযায়ী প্রোডাক্টভিত্তিক সেলস পরিসংখ্যান।
 * Returns: { items: [{productId, productName, image, qty}], totalQty }
 */
// async function fetchSalesByRange({ merchantId, startUTC, endUTC }) {
//   // 1) Group by productId & sum quantity
//   const grouped = await prisma.sale.groupBy({
//     by: ["productId"],
//     where: {
//       merchantId,
//       createdAt: { gte: startUTC, lt: endUTC },
//     },
//     _sum: { quantity: true },
//   });

//   if (grouped.length === 0) {
//     return { items: [], totalQty: 0 };
//   }

//   // 2) Fetch product titles + image (frontImg or first variant.frontImg)
//   const productIds = grouped.map((g) => g.productId);

//   const products = await prisma.product.findMany({
//     where: { id: { in: productIds } },
//     select: {
//       id: true,
//       productId: true,
//       title: true,
//       frontDesign: true,
//       variants: {
//         take: 1,
//         select: { frontImg: true },
//       },
//     },
//   });

//   const productMap = new Map(
//     products.map((p) => [
//       p.id,
//       {
//         title: p.title,
//         image: p.frontImg || (p.variants[0]?.frontImg ?? null),
//         productId: p.productId,
//       },
//     ])
//   );

//   // 3) Build rows, sort by qty desc
//   const items = grouped
//     .map((g) => {
//       const qty = Number(g._sum.quantity || 0);
//       const product = productMap.get(g.productId) || {};
//        // Generate signed URL for the image using the S3 key
//       // Check if the image field is fulfilled and then get the signed URL
//       const imageUrl = product.image;
//       const signedImageUrl = imageUrl ? await getPrivateUrl(imageUrl, 60 * 60) : null;
//       return {
//         productId: product.productId || null, // ✅ business productId
//         productDbId: g.productId,
//         productName: product.title || "Unknown Product",
//          image: signedImageUrl, // Use signed URL for the image
//         qty,
//       };
//     })
//     .sort((a, b) => b.qty - a.qty);

//   const totalQty = items.reduce((acc, r) => acc + r.qty, 0);

//   return { items, totalQty };
// }

// ======== Public Server Action ========

async function fetchSalesByRange({ merchantId, startUTC, endUTC }) {
  // 1) Group by productId & sum quantity
  const grouped = await prisma.sale.groupBy({
    by: ["productId"],
    where: {
      merchantId,
      createdAt: { gte: startUTC, lt: endUTC },
    },
    _sum: { quantity: true },
  });

  if (grouped.length === 0) {
    return { items: [], totalQty: 0 };
  }

  // 2) Fetch product titles + image (frontImg or first variant.frontImg)
  const productIds = grouped.map((g) => g.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      productId: true,
      title: true,
      frontDesign: true,
      variants: {
        take: 1,
        select: { frontImg: true },
      },
    },
  });

  const productMap = new Map(
    products.map((p) => [
      p.id,
      {
        title: p.title,
        image: p.frontImg || (p.variants[0]?.frontImg ?? null),
        productId: p.productId,
      },
    ])
  );

  // 3) Use Promise.all to ensure async operations are handled properly
  const items = await Promise.all(
    grouped.map(async (g) => {
      const qty = Number(g._sum.quantity || 0);
      const product = productMap.get(g.productId) || {};
      
      // Generate signed URL for the image using the S3 key
      const imageUrl = product.image;
      const signedImageUrl = imageUrl ? await getPrivateUrl(imageUrl, 60 * 60) : null;

      return {
        productId: product.productId || null, // ✅ business productId
        productDbId: g.productId,
        productName: product.title || "Unknown Product",
        image: signedImageUrl, // Use signed URL for the image
        qty,
      };
    })
  );

  const totalQty = items.reduce((acc, r) => acc + r.qty, 0);

  return { items, totalQty };
}

export async function getMerchantSalesKpis(merchantId) {
  if (!merchantId) throw new Error("merchantId is required");

  const ranges = buildDhakaRanges();

  const [today, last7d, last30d, last90d] = await Promise.all([
    fetchSalesByRange({ merchantId, ...ranges.today }),
    fetchSalesByRange({ merchantId, ...ranges.last7d }),
    fetchSalesByRange({ merchantId, ...ranges.last30d }),
    fetchSalesByRange({ merchantId, ...ranges.last90d }),
  ]);

  return {
    merchantId,
    ranges: {
      today,
      last7d,
      last30d,
      last90d,
    },
  };
}
