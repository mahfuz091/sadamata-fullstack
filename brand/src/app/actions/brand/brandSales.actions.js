'use server'

import { prisma } from '@/lib/prisma'
import { getPrivateUrl } from "@/lib/s3";
import { OrderStatus } from '@/generated/prisma'

// ======== Time helpers (Dhaka-aligned, UTC+6) ========
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000

function nowDhaka() {
  const now = new Date()
  return new Date(now.getTime() + DHAKA_OFFSET_MS)
}

function startOfDhakaDay(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0))
}

function addDays(date, days) {
  const d = new Date(date.getTime())
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function toUTC(dateInDhakaLocalMidnight) {
  return new Date(dateInDhakaLocalMidnight.getTime() - DHAKA_OFFSET_MS)
}

function getDhakaDayKey(date) {
  const d = new Date(date.getTime() + DHAKA_OFFSET_MS)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDhakaDayLabel(date) {
  const d = new Date(date.getTime() + DHAKA_OFFSET_MS)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
}

function buildDhakaRanges() {
  const nowD = nowDhaka()
  const todayStartDhaka = startOfDhakaDay(nowD)
  const tomorrowStartDhaka = addDays(todayStartDhaka, 1)

  const last7StartDhaka = addDays(todayStartDhaka, -6)
  const last30StartDhaka = addDays(todayStartDhaka, -29)
  const last90StartDhaka = addDays(todayStartDhaka, -89)

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
  }
}

// ======== Core query helper ========

/**
 * এক রেঞ্জে merchantId অনুযায়ী প্রোডাক্টভিত্তিক সেলস পরিসংখ্যান।
 * Returns: { items: [{productId, productName, image, qty}], totalQty }
 */
async function fetchSalesByRange({ userId, startUTC, endUTC }) {
  if (!userId) throw new Error("userId required");

  const firstBrand = await prisma.brand.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  if (!firstBrand) {
    return {
      userId,
      brandFound: false,
      message: "No brand found for this user",
    };
  }

  const { id: brandId } = firstBrand;

  // 1️⃣ Group by productId & sum quantity
  const soldStatuses = [
    OrderStatus.PAID,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
  ];

  const orders = await prisma.order.findMany({
    where: {
      status: { in: soldStatuses },
      createdAt: { gte: startUTC, lt: endUTC },
    },
    select: {
      items: {
        select: {
          productId: true,
          quantity: true,
        },
      },
    },
  });

  const quantityByProductId = new Map();
  for (const order of orders) {
    for (const item of order.items) {
      if (!item.productId) continue;
      quantityByProductId.set(
        item.productId,
        (quantityByProductId.get(item.productId) || 0) +
          Number(item.quantity || 0)
      );
    }
  }

  if (quantityByProductId.size === 0) {
    return { items: [], totalQty: 0 };
  }

  // 2️⃣ Fetch product titles + image
  const productIds = Array.from(quantityByProductId.keys());

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, brandId },
    select: {
      id: true,
      productId: true,
      title: true,
      variants: {
        select: {
          color: true,
          frontImg: true,
          backImg: true,
        },
      },
    },
  });

  const productMap = new Map(
    products.map((p) => {
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const normalizedVariants = variants.map((variant) => ({
        ...variant,
        normalizedColor: String(variant.color || "").trim().toLowerCase(),
      }));

      const preferredVariant =
        normalizedVariants.find((variant) => variant.normalizedColor === "black" && variant.frontImg) ||
        normalizedVariants.find((variant) => variant.normalizedColor === "white" && variant.frontImg) ||
        normalizedVariants.find((variant) => variant.frontImg) ||
        normalizedVariants.find((variant) => variant.backImg) ||
        null;

      return [
        p.id,
        {
          id: p.id,
          productId: p.productId,
          title: p.title,
          image: preferredVariant?.frontImg || preferredVariant?.backImg || null,
        },
      ];
    })
  );

  // 3️⃣ Generate signed URLs properly (async)
  const salesProducts = Array.from(productMap.values());

  const items = await Promise.all(
    salesProducts.map(async (product) => {
      const qty = Number(quantityByProductId.get(product.id) || 0);

      const imageKey = product.image;
      const signedImageUrl = imageKey
        ? await getPrivateUrl(imageKey, 60 * 60) // 1 hour expiry
        : null;

      return {
        id: product.id,
        productId: product.productId || null,
        productName: product.title || "Unknown Product",
        image: signedImageUrl,
        qty,
      };
    })
  );

  // 4️⃣ Sort by qty desc
  items.sort((a, b) => b.qty - a.qty);

  const totalQty = items.reduce((acc, r) => acc + r.qty, 0);

  return { items, totalQty };
}

async function fetchLast7DaysSalesChart({ userId, startUTC, endUTC }) {
  if (!userId) throw new Error("userId required");

  const firstBrand = await prisma.brand.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!firstBrand) {
    return [];
  }

  const soldStatuses = [
    OrderStatus.PAID,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
  ];

  const orders = await prisma.order.findMany({
    where: {
      status: { in: soldStatuses },
      createdAt: { gte: startUTC, lt: endUTC },
    },
    select: {
      createdAt: true,
      items: {
        select: {
          productId: true,
          quantity: true,
        },
      },
    },
  });

  const productIds = Array.from(
    new Set(
      orders
        .flatMap((order) => order.items.map((item) => item.productId))
        .filter(Boolean)
    )
  );

  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds }, brandId: firstBrand.id },
        select: { id: true },
      })
    : [];

  const brandProductIds = new Set(products.map((product) => product.id));
  const salesByDay = new Map();

  for (const order of orders) {
    const key = getDhakaDayKey(order.createdAt);
    const qty = order.items.reduce((total, item) => {
      if (!item.productId || !brandProductIds.has(item.productId)) {
        return total;
      }
      return total + Number(item.quantity || 0);
    }, 0);

    if (qty > 0) {
      salesByDay.set(key, (salesByDay.get(key) || 0) + qty);
    }
  }

  const days = [];
  for (let i = 0; i < 7; i++) {
    const dhakaDay = addDays(startOfDhakaDay(nowDhaka()), i - 6);
    const utcDay = toUTC(dhakaDay);
    const key = getDhakaDayKey(utcDay);

    days.push({
      date: key,
      label: getDhakaDayLabel(utcDay),
      sales: salesByDay.get(key) || 0,
    });
  }

  return days;
}

// ======== Public Server Action ========

export async function getBrandSalesKpis(brandId) {
  if (!brandId) throw new Error('brandId is required')

  const ranges = buildDhakaRanges()

  const [today, last7d, last30d, last90d, last7DaysChart] = await Promise.all([
    fetchSalesByRange({ userId: brandId, ...ranges.today }),
    fetchSalesByRange({ userId: brandId, ...ranges.last7d }),
    fetchSalesByRange({ userId: brandId, ...ranges.last30d }),
    fetchSalesByRange({ userId: brandId, ...ranges.last90d }),
    fetchLast7DaysSalesChart({ userId: brandId, ...ranges.last7d }),
  ])

  return {
    brandId,
    last7DaysChart,
    ranges: {
      today,
      last7d,
      last30d,
      last90d,
    },
  }
}
