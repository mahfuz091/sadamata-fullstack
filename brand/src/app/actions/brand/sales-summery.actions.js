"use server";

import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

/** --------- helpers --------- */
function buildDateRange(from, to) {
  const range = {};

  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    range.gte = start;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }

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
 * - Ã Â¦ÂªÃ Â§ÂÃ Â¦Â°Ã Â¦Â¥Ã Â¦Â®Ã Â§â€¡ userId Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° brand Ã Â¦â€”Ã Â§ÂÃ Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¿
 * - Ã Â¦Â¯Ã Â¦Â¦Ã Â¦Â¿ brandId Ã Â¦ÂªÃ Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡: Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€œÃ Â¦â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â­Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¿
 * - Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¡ brandId/brandIds Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ÂªÃ Â§ÂÃ Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ÂÃ Â¦Å¸ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ sales/cancelled Ã Â¦â€¦Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦â€”Ã Â§ÂÃ Â¦Â°Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¿
 *
 * params:
 *  - userId (required)
 *  - brandId (optional) -> Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ÂÃ Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ÂÃ Â¦Å¸ Ã Â¦Â¬Ã Â§ÂÃ Â¦Â°Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¡; Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¬Ã Â§ÂÃ Â¦Â°Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¡
 *  - page, pageSize
 *  - dateFrom, dateTo (Order.createdAt Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¡Ã Â§â€¹)
 *  - merchantId (optional) -> Ã Â¦â€œÃ Â¦â€¡ Ã Â¦Â¬Ã Â§ÂÃ Â¦Â°Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ÂÃ Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ÂÃ Â¦Å¸ owner/merchant-Ã Â¦ÂÃ Â¦Â° Ã Â¦ÂªÃ Â§ÂÃ Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ÂÃ Â¦Å¸Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â§â‚¬Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¦Ã Â§ÂÃ Â¦Â§
 */
export async function getBrandProductSalesSummaryByUser({
  userId,
  brandId,          // optional; Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€œÃ Â¦â€¡ Ã Â¦Â¬Ã Â§ÂÃ Â¦Â°Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¡Ã Â§â€¡ Ã Â¦Â¸Ã Â§â‚¬Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¦Ã Â§ÂÃ Â¦Â§
  page = 1,
  pageSize = 12,
  dateFrom,
  dateTo,
  merchantId,       // optional owner filter: Product.userId
  searchTerm, 
} = {}) {
  noStore();
  if (!userId) throw new Error("userId is required");
  await assertUserActive(userId);

  // 1) Ã Â¦ÂÃ Â¦â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° brand(s) Ã Â¦â€ Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¨
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

  // Ã Â¦Â¯Ã Â¦Â¦Ã Â¦Â¿ brandId Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡ Ã¢â€ â€™ Ã Â¦â€œÃ Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Âª/Ã Â¦ÂÃ Â¦â€¢Ã Â§ÂÃ Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ÂÃ Â¦Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â§ÂÃ Â¦Â¸ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢
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
    // Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Active brand
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

  // 2) Ã Â¦ÂªÃ Â§ÂÃ Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ÂÃ Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ (brandIds + optional merchantId filter)
 const take = Math.min(100, Math.max(1, pageSize));
  const skip = (Math.max(1, page) - 1) * take;

  const orderDateFilter = buildDateRange(dateFrom, dateTo);

  const productWhereBase = {
    brandId: { in: brandIds },
    ...(merchantId ? { userId: merchantId } : {}),
    ...(searchTerm
      ? {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      : {}),
  };

  let productWhere = productWhereBase;

  if (orderDateFilter) {
    const candidateProducts = await prisma.product.findMany({
      where: productWhereBase,
      select: { id: true },
    });

    const candidateProductIds = candidateProducts.map((product) => product.id);

    if (!candidateProductIds.length) {
      return {
        items: [],
        page,
        pageSize: take,
        total: 0,
        totalPages: 0,
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

    const [paidProductRows, cancelledProductRows] = await Promise.all([
      prisma.sale.findMany({
        where: {
          productId: { in: candidateProductIds },
          orderItem: {
            order: {
              status: "PAID",
              createdAt: orderDateFilter,
            },
          },
        },
        select: { productId: true },
        distinct: ["productId"],
      }),
      prisma.orderItem.findMany({
        where: {
          productId: { in: candidateProductIds },
          order: {
            status: "CANCELLED",
            createdAt: orderDateFilter,
          },
        },
        select: { productId: true },
        distinct: ["productId"],
      }),
    ]);

    const filteredProductIds = Array.from(
      new Set([
        ...paidProductRows.map((row) => row.productId).filter(Boolean),
        ...cancelledProductRows.map((row) => row.productId).filter(Boolean),
      ])
    );

    productWhere = {
      ...productWhereBase,
      id: { in: filteredProductIds },
    };
  }

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
        variants: {
          select: {
            color: true,
            frontImg: true,
            backImg: true,
          },
        },
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

  // 3) Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ÂÃ Â¦Å¸Ã Â¦Â¾Ã Â¦Â° (Order.createdAt)

  // 4) PAID sales Ã¢â€ â€™ JS reduce
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
      // royalty breakdowns Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€”Ã Â§ÂÃ Â¦Â²Ã Â§â€¹Ã Â¦â€œ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨:
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

  // 5) CANCELLED Ã¢â€ â€™ OrderItem Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ (JS reduce)
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

  // 6) Ã Â¦Â«Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â«Ã Â¦Â² Ã Â¦Â®Ã Â§ÂÃ Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€š
  const items = products.map(p => {
    const paid = paidMap.get(p.id) || {
      purchasedQty: 0,
      revenue: 0,
      brandRoyalty: 0,
      merchantRoyalty: 0,
      platformEarning: 0,
    };
    const cancelledQty = cancelMap.get(p.id) || 0;
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

    return {
      id: p.id,
      productId: p.productId,
      title: p.title,
      brandName: p.Brand?.name || p.brandName || null,

      purchasedQty: paid.purchasedQty,
      cancelledQty,
      returnedQty: 0, // Refund Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â§Å¸ 0

      revenue: Number(paid.revenue.toFixed(2)),
      brandRoyalty: Number(paid.brandRoyalty.toFixed(2)),
      merchantRoyalty: Number(paid.merchantRoyalty.toFixed(2)),
      platformEarning: Number(paid.platformEarning.toFixed(2)),

      updatedAt: p.updatedAt,
      previewImg: preferredVariant?.frontImg || preferredVariant?.backImg || null,
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
