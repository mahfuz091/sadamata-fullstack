"use server";

import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

/** --------- helpers --------- */
function buildDateRange(from, to) {
  const range = {};
  if (from) range.gte = new Date(from);
  if (to) range.lte = new Date(to);
  return Object.keys(range).length ? range : undefined;
}

async function assertUserActive(userId) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true },
  });
  if (!u) throw new Error("User not found");
  if (!u.isActive) throw new Error("User is disabled");
  return u;
}

/**
 * Brand product-wise sales summary (like merchant version)
 * - প্রথমে userId দিয়ে ইউজারের brand গুলো বের করি
 * - যদি brandId প্যারাম থাকে: সেটি ওই ইউজারের কিনা ভেরিফাই করি
 * - তারপর সেই brandId/brandIds দিয়ে প্রোডাক্ট বের করে sales/cancelled অ্যাগ্রিগেট করি
 *
 * params:
 *  - userId (required)
 *  - brandId (optional) -> নির্দিষ্ট ব্র্যান্ড; না দিলে ইউজারের সব ব্র্যান্ড
 *  - page, pageSize
 *  - dateFrom, dateTo (Order.createdAt উইন্ডো)
 *  - merchantId (optional) -> ওই ব্র্যান্ডের ভিতরে নির্দিষ্ট owner/merchant-এর প্রোডাক্টেই সীমাবদ্ধ
 */
export async function getBrandProductSalesSummaryByUser({
  userId,
  brandId,          // optional; দিলে ওই ব্র্যান্ডে সীমাবদ্ধ
  page = 1,
  pageSize = 12,
  dateFrom,
  dateTo,
  merchantId,       // optional owner filter: Product.userId
} = {}) {
  noStore();
  if (!userId) throw new Error("userId is required");
  await assertUserActive(userId);

  // 1) এই ইউজারের brand(s) আনুন
  const brands = await prisma.brand.findMany({
    where: { userId },
    select: { id: true, name: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!brands.length) {
    return {
      items: [],
      page,
      pageSize: Math.min(100, Math.max(1, pageSize)),
      total: 0,
      totalPages: 0,
      meta: { brandIds: [], brandCount: 0, note: "No brands for this user" },
    };
  }

  // যদি brandId দেওয়া থাকে → ওনারশিপ/এক্সিস্টেন্স চেক
  let brandIds;
  if (brandId) {
    const found = brands.find(b => b.id === brandId);
    if (!found) throw new Error("Brand not found for this user");
    if (!found.isActive) {
      return {
        items: [],
        page,
        pageSize: Math.min(100, Math.max(1, pageSize)),
        total: 0,
        totalPages: 0,
        meta: { brandIds: [brandId], brandCount: 1, note: "Brand is disabled" },
      };
    }
    brandIds = [brandId];
  } else {
    // না দিলে ইউজারের সব Active brand
    brandIds = brands.filter(b => b.isActive).map(b => b.id);
    if (!brandIds.length) {
      return {
        items: [],
        page,
        pageSize: Math.min(100, Math.max(1, pageSize)),
        total: 0,
        totalPages: 0,
        meta: { brandIds: [], brandCount: 0, note: "All brands are disabled" },
      };
    }
  }

  // 2) প্রোডাক্ট পেজিনেশন (brandIds + optional merchantId filter)
  const take = Math.min(100, Math.max(1, pageSize));
  const skip = (Math.max(1, page) - 1) * take;

  const productWhere = {
    brandId: { in: brandIds },
    ...(merchantId ? { userId: merchantId } : {}), // owner filter (optional)
  };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where: productWhere }),
    prisma.product.findMany({
      where: productWhere,
      orderBy: { updatedAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        productId: true,
        title: true,
        price: true,
        updatedAt: true,
        brandName: true,
        Brand: { select: { id: true, name: true } },
        variants: { select: { frontImg: true }, take: 1 },
      },
    }),
  ]);

  const ids = products.map(p => p.id);
  if (!ids.length) {
    return {
      items: [],
      page,
      pageSize: take,
      total,
      totalPages: Math.ceil(total / take),
      meta: { brandIds, brandCount: brandIds.length },
    };
  }

  // 3) ডেট ফিল্টার (Order.createdAt)
  const orderDateFilter = buildDateRange(dateFrom, dateTo);

  // 4) PAID sales → JS reduce
  const saleRows = await prisma.sale.findMany({
    where: {
      productId: { in: ids },
      orderItem: {
        order: {
          status: "PAID",
          ...(orderDateFilter ? { createdAt: orderDateFilter } : {}),
        },
      },
    },
    select: {
      productId: true,
      quantity: true,
      total: true,
      // royalty breakdowns থাকলে সেগুলোও যোগ করতে পারেন:
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
  });

  const paidMap = new Map();
  for (const r of saleRows) {
    const cur = paidMap.get(r.productId) || {
      purchasedQty: 0,
      revenue: 0,
      brandRoyalty: 0,
      merchantRoyalty: 0,
      platformEarning: 0,
    };
    cur.purchasedQty += r.quantity || 0;
    cur.revenue += Number(r.total || 0);
    cur.brandRoyalty += Number(r.brandEarning || 0);
    cur.merchantRoyalty += Number(r.merchantEarning || 0);
    cur.platformEarning += Number(r.platformEarning || 0);
    paidMap.set(r.productId, cur);
  }

  // 5) CANCELLED → OrderItem থেকে (JS reduce)
  const cancelRows = await prisma.orderItem.findMany({
    where: {
      productId: { in: ids },
      order: {
        status: "CANCELLED",
        ...(orderDateFilter ? { createdAt: orderDateFilter } : {}),
      },
    },
    select: { productId: true, quantity: true },
  });

  const cancelMap = new Map();
  for (const r of cancelRows) {
    const cur = cancelMap.get(r.productId) || 0;
    cancelMap.set(r.productId, cur + (r.quantity || 0));
  }

  // 6) ফলাফল ম্যাপিং
  const items = products.map(p => {
    const paid = paidMap.get(p.id) || {
      purchasedQty: 0,
      revenue: 0,
      brandRoyalty: 0,
      merchantRoyalty: 0,
      platformEarning: 0,
    };
    const cancelledQty = cancelMap.get(p.id) || 0;

    return {
      id: p.id,
      productId: p.productId,
      title: p.title,
      brandName: p.Brand?.name || p.brandName || null,

      purchasedQty: paid.purchasedQty,
      cancelledQty,
      returnedQty: 0, // Refund না থাকায় 0

      revenue: Number(paid.revenue.toFixed(2)),
      brandRoyalty: Number(paid.brandRoyalty.toFixed(2)),
      merchantRoyalty: Number(paid.merchantRoyalty.toFixed(2)),
      platformEarning: Number(paid.platformEarning.toFixed(2)),

      updatedAt: p.updatedAt,
      previewImg: p.variants?.[0]?.frontImg || null,
    };
  });

  return {
    items,
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
    meta: {
      userId,
      brandIds,
      brandCount: brandIds.length,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      merchantFilter: merchantId || null,
    },
  };
}
