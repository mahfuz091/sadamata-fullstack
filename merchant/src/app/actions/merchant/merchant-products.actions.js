// ============================
// File: src/server/merchant-products.actions.js
// ============================
"use server";


import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function assertIsMerchant(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });
  if (!user) throw new Error("User not found");
  if (!user.isActive) throw new Error("User is disabled");
//   if (user.role !== Role.MERCH ) {
//     throw new Error("Not authorized");
//   }
}

function buildWhere({ merchantId, brandId, isActive, visibility }) {
  const where = { userId: merchantId };
  if (brandId) where.brandId = brandId;
  if (typeof isActive === "boolean") where.isActive = isActive;
  if (typeof visibility === "boolean") where.visibility = visibility;
  return where;
}

// Main action: fetch products for a merchant (paginated)
export async function getMerchantProducts({
  merchantId,
  page = 1,
  pageSize = 12,
  brandId,
  isActive,
  visibility,
  sort = "createdAt_desc",
} = {}) {
  noStore();
  if (!merchantId) throw new Error("merchantId is required");

  const where = buildWhere({ merchantId, brandId, isActive, visibility });
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
        updatedAt: true,
        brandName: true,
        Mockup: { select: { name: true } }, // only mockup name
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
    updatedAt: p.updatedAt,
    brandName: p.brandName,
    brand: p.Brand,
    mockupName: p.Mockup?.name || null,
    previewImg: p.variants?.[0]?.frontImg || null,
  }));

  return {
    items,
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
  };
}
// ============================
// File: src/server/merchant-products.actions.js
// ============================

export async function deleteMerchantProduct(_prev, formData) {
  const merchantId = formData.get("merchantId");
  const productId = formData.get("productId");

  if (!merchantId || !productId) {
    throw new Error("merchantId and productId are required");
  }

  await assertIsMerchant(merchantId);

  // 1) Validate product ownership
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, userId: true },
  });

  if (!product) throw new Error("Product not found");
  if (product.userId !== merchantId)
    throw new Error("Not allowed to delete this product");

  // 2) Delete product
  await prisma.product.delete({
    where: { id: productId },
  });

  // 3) Increase leftTiar by +1
  await prisma.merchantProfile.update({
    where: { userId: merchantId },
    data: {
      leftTiar: {
        increment: 1,
      },
    },
  });

  // 4) Revalidate UI
  revalidatePath("/dashboard/manage");

  return {
    success: true,
    message: "Product deleted successfully",
    productId,
  };
}
