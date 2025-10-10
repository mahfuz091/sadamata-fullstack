"use server";

// Merchant product-wise sales summary (Purchased, Cancelled, Returned, Revenue, Royalties)
// Rewritten AGAIN to avoid groupBy/raw bugs by aggregating in JS over small page sets.
// This is safe because we only fetch a page (e.g., 10-12 products) at a time.

import { unstable_noStore as noStore } from "next/cache";
import { prisma} from "@/lib/prisma";

function buildDateRange(from, to) {
  const range = {};
  if (from) range.gte = new Date(from);
  if (to) range.lte = new Date(to);
  return Object.keys(range).length ? range : undefined;
}

export async function getMerchantProductSalesSummary({
  merchantId,
  page = 1,
  pageSize = 12,
  brandId,
  dateFrom,
  dateTo,
} = {}) {
  noStore();
  if (!merchantId) throw new Error("merchantId is required");
  

  const take = Math.min(100, Math.max(1, pageSize));
  const skip = (Math.max(1, page) - 1) * take;

  const productWhere = { userId: merchantId };
  if (brandId) productWhere.brandId = brandId;

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

  const ids = products.map((p) => p.id);
  if (ids.length === 0) {
    return { items: [], page, pageSize: take, total, totalPages: Math.ceil(total / take) };
  }

  // Build date filter once
  const orderDateFilter = buildDateRange(dateFrom, dateTo);

  // Fetch PAID sales rows (no groupBy) and reduce in JS
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
    select: { productId: true, quantity: true, total: true, merchantEarning: true },
  });

  const paidMap = new Map(); // productId -> { purchasedQty, revenue, royalties }
  for (const r of saleRows) {
    const cur = paidMap.get(r.productId) || { purchasedQty: 0, revenue: 0, royalties: 0 };
    cur.purchasedQty += r.quantity || 0;
    cur.revenue += Number(r.total || 0);
    cur.royalties += Number(r.merchantEarning || 0);
    paidMap.set(r.productId, cur);
  }

  // Fetch CANCELLED order items and reduce in JS
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

  const cancelMap = new Map(); // productId -> qty
  for (const r of cancelRows) {
    const cur = cancelMap.get(r.productId) || 0;
    cancelMap.set(r.productId, cur + (r.quantity || 0));
  }

  const items = products.map((p) => {
    const paid = paidMap.get(p.id) || { purchasedQty: 0, revenue: 0, royalties: 0 };
    const cancelledQty = cancelMap.get(p.id) || 0;
    return {
      id: p.id,
      productId: p.productId,
      title: p.title,
      brandName: p.Brand?.name || p.brandName || null,
      purchasedQty: paid.purchasedQty,
      cancelledQty,
      returnedQty: 0, // add logic if a Return model exists
      revenue: Number(paid.revenue.toFixed(2)),
      royalties: Number(paid.royalties.toFixed(2)),
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
  };
}
