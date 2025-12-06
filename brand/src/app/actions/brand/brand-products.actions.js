// ============================
// File: src/server/brand-products.actions.js
// ============================
"use server";

import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

/** ---- Utils: common orderBy builder ---- */
function buildOrderBy(sort = "createdAt_desc") {
  switch (sort) {
    case "createdAt_asc":
      return [{ createdAt: "asc" }];
    case "updatedAt_desc":
      return [{ updatedAt: "desc" }];
    case "updatedAt_asc":
      return [{ updatedAt: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "price_asc":
      return [{ price: "asc" }];
    case "title_asc":
      return [{ title: "asc" }];
    case "title_desc":
      return [{ title: "desc" }];
    case "createdAt_desc":
    default:
      return [{ createdAt: "desc" }];
  }
}

/** ---- 0) ইউজার এক্সিস্ট + একটিভ কিনা চেক ---- */
export async function assertUserActive(userId) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true },
  });
  if (!u) throw new Error("User not found");
  if (!u.isActive) throw new Error("User is disabled");
  return u;
}

/** ---- 1) ইউজারের সব ব্র্যান্ড (ঐচ্ছিক ফিল্টার: isActive) ----
 * returns: { brands: [{id, name, isActive, brandCategoryId}], count }
 */
export async function getUserBrands(userId, { onlyActive = false } = {}) {
  noStore();
  await assertUserActive(userId);

  const where = { userId };
  if (onlyActive) where.isActive = true;

  const brands = await prisma.brand.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      isActive: true,
      brandCategoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { count: brands.length, brands };
}

/** ---- 2) নির্দিষ্ট brandId টি কি এই user-এর? ----
 * notFound হলে error, notOwned হলে error (সিকিউরিটি)
 */
export async function assertBrandOwnedByUser(userId, brandId) {
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, userId: true, isActive: true, name: true },
  });
  if (!brand) throw new Error("Brand not found");
  if (brand.userId !== userId) throw new Error("Not authorized for this brand");
  if (!brand.isActive) throw new Error("Brand is disabled");
  return brand;
}

/** ---- 3) ব্র্যান্ড অনুযায়ী প্রোডাক্ট লিস্ট (strict brandId + userId) ----
 * ফ্রন্টএন্ড থেকে userId আসে, আমরা আগে ভেরিফাই করি brandId ওই user-এর কিনা, তারপর নিয়ে আসি প্রোডাক্ট।
 * filters:
 *   - isActive (boolean)
 *   - visibility (boolean)
 *   - search (title contains)
 * pagination:
 *   - page, pageSize (max 100)
 * sort:
 *   - createdAt_desc | createdAt_asc | updatedAt_desc | updatedAt_asc
 *   - price_desc | price_asc | title_asc | title_desc
 */
export async function getBrandProductsByUser({
  userId,
  brandId,
  page = 1,
  pageSize = 12,
  isActive,
  visibility,
  search,
  sort = "createdAt_desc",
} = {}) {
  noStore();
  if (!userId) throw new Error("userId is required");
  if (!brandId) throw new Error("brandId is required");

  await assertUserActive(userId);
  const brand = await assertBrandOwnedByUser(userId, brandId);

  const where = {
    brandId: brand.id,
    userId, // ডাবল চেক: প্রোডাক্ট owner-ও এই ইউজার
  };

  if (typeof isActive === "boolean") where.isActive = isActive;
  if (typeof visibility === "boolean") where.visibility = visibility;
  if (search && search.trim()) {
    where.title = { contains: search.trim(), mode: "insensitive" };
  }

  const orderBy = buildOrderBy(sort);
  const take = Math.min(100, Math.max(1, pageSize));
  const skip = (Math.max(1, page) - 1) * take;

  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        productId: true,
        title: true,
        price: true,
        isActive: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        brandId: true,
        brandName: true,
        userId: true,
        Mockup: { select: { name: true } },
        Brand: { select: { id: true, name: true, isActive: true } },
        variants: { select: { frontImg: true }, take: 1 },
      },
    }),
  ]);

  const items = rows.map((p) => ({
    id: p.id,
    productId: p.productId,
    title: p.title,
    price: p.price,
    isActive: p.isActive,
    visibility: p.visibility,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    brandId: p.brandId,
    brandName: p.brandName,
    brand: p.Brand,
    merchantId: p.userId,
    mockupName: p.Mockup?.name || null,
    previewImg: p.variants?.[0]?.frontImg || null,
  }));

  return {
    brand: { id: brand.id, name: brand.name, isActive: brand.isActive },
    items,
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
    meta: {
      sort,
      filters: {
        isActive: typeof isActive === "boolean" ? isActive : undefined,
        visibility: typeof visibility === "boolean" ? visibility : undefined,
        search: search || undefined,
      },
    },
  };
}

/** ---- 4) (ঐচ্ছিক) ওই ইউজারের সব ব্র্যান্ডের সব প্রোডাক্ট (brandId না দিলে) ----
 * অনেকেই চান “userId দিয়ে ব্র্যান্ড-ওনারের সব ব্র্যান্ড কম্বাইন্ড প্রোডাক্ট”।
 * এটা আলাদা রাখলাম যেন পরিষ্কার থাকে।
 */
export async function getAllBrandProductsOfUser({
  userId,
  page = 1,
  pageSize = 12,
  isActive,
  visibility,
  search,
  sort = "createdAt_desc",
} = {}) {
  noStore();
  if (!userId) throw new Error("userId is required");
  await assertUserActive(userId);

  // 🧩 Step 1: ওই ইউজারের সব brand খুঁজে আনুন
  const brands = await prisma.brand.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  console.log(brands, "brands");

  if (!brands.length) {
    return {
      items: [],
      total: 0,
      totalPages: 0,
      page,
      pageSize,
      message: "No brands found for this user",
    };
  }

  // সব brandId collect করুন
  const brandIds = brands.map((b) => b.id);

  // 🧩 Step 2: ওই brandId গুলোর প্রোডাক্ট আনুন
  const where = {
    brandId: brands[0].id,
  };

  console.log(where, "where");

  if (typeof isActive === "boolean") where.isActive = isActive;
  if (typeof visibility === "boolean") where.visibility = visibility;
  if (search && search.trim()) {
    where.title = { contains: search.trim(), mode: "insensitive" };
  }

  const orderBy = (() => {
    switch (sort) {
      case "createdAt_asc":
        return [{ createdAt: "asc" }];
      case "price_desc":
        return [{ price: "desc" }];
      case "price_asc":
        return [{ price: "asc" }];
      case "title_asc":
        return [{ title: "asc" }];
      case "title_desc":
        return [{ title: "desc" }];
      case "createdAt_desc":
      default:
        return [{ createdAt: "desc" }];
    }
  })();

  const take = Math.min(100, Math.max(1, pageSize));
  const skip = (Math.max(1, page) - 1) * take;

  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        productId: true,
        title: true,
        price: true,
        isActive: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        brandId: true,
        brandName: true,
        userId: true,
        Mockup: { select: { name: true } },
        Brand: { select: { id: true, name: true, isActive: true } },
        variants: { select: { frontImg: true }, take: 1 },
      },
    }),
  ]);

  const items = rows.map((p) => ({
    id: p.id,
    productId: p.productId,
    title: p.title,
    price: p.price,
    isActive: p.isActive,
    visibility: p.visibility,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    brandId: p.brandId,
    brandName: p.brandName,
    brand: p.Brand,
    merchantId: p.userId,
    mockupName: p.Mockup?.name || null,
    previewImg: p.variants?.[0]?.frontImg || null,
  }));

  return {
    items,
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
    meta: {
      sort,
      brandCount: brandIds.length,
      brands: brands.map((b) => ({ id: b.id, name: b.name })),
      filters: { isActive, visibility, search: search || undefined },
    },
  };
}
