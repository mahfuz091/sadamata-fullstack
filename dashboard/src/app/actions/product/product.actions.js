"use server";

import { prisma } from "@/lib/prisma";

/* -----------------------------
   Helpers (serialization safe)
--------------------------------*/

function serializeDate(value) {
  if (!value) return value;
  return value.toISOString();
}

function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    createdAt: serializeDate(product.createdAt),
    updatedAt: serializeDate(product.updatedAt),

    // ✅ matches schema + your UI r.User
    User: product.User
      ? {
          id: product.User.id,
          name: product.User.name,
          email: product.User.email,
        }
      : null,

    Brand: product.Brand
      ? { id: product.Brand.id, name: product.Brand.name }
      : null,
  };
}

/* -----------------------------
   GET PRODUCTS (PAGINATED + FILTERS + DROPDOWNS)
--------------------------------*/

export async function getProducts({
  page = 1,
  pageSize = 10,
  merchantId = null, // maps to Product.userId
  brandId = null, // maps to Product.brandId
  q = "",
} = {}) {
  try {
    const safePage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(pageSize) || 10, 1), 100); // 1..100
    const skip = (safePage - 1) * take;

    const query = typeof q === "string" ? q.trim() : "";

    // The brand dropdown used to be built from User rows, so older links carry a
    // User.id while Product.brandId references Brand.id — nothing ever matched.
    // Accept either id here so bookmarked URLs keep working.
    let resolvedBrandId = brandId || null;
    if (resolvedBrandId) {
      const brand = await prisma.brand.findFirst({
        where: { OR: [{ id: resolvedBrandId }, { userId: resolvedBrandId }] },
        select: { id: true },
      });
      resolvedBrandId = brand?.id ?? resolvedBrandId;
    }

    const where = {
      ...(merchantId ? { userId: merchantId } : {}),
      ...(resolvedBrandId ? { brandId: resolvedBrandId } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { productId: { contains: query, mode: "insensitive" } }, // ✅ your unique productId
              { smpin: { contains: query, mode: "insensitive" } },
              { User: { name: { contains: query, mode: "insensitive" } } },
              { User: { email: { contains: query, mode: "insensitive" } } },
              { Brand: { name: { contains: query, mode: "insensitive" } } },
              { brandName: { contains: query, mode: "insensitive" } }, // ✅ fallback
            ],
          }
        : {}),
    };

    const [items, total, merchants, brands] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          User: { select: { id: true, name: true, email: true } },
          Brand: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.product.count({ where }),

      // ✅ merchants dropdown
      prisma.user.findMany({
        where: { role: "MERCH" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),

      // ✅ brands dropdown — Brand.id, because that is what Product.brandId holds
      prisma.brand.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      success: true,
      data: {
        items: items.map(serializeProduct),
        merchants,
        brands,
        meta: {
          total,
          page: safePage,
          pageSize: take,
          totalPages: Math.ceil(total / take),
        },
      },
    };
  } catch (err) {
    console.error("getProducts error:", err);
    return { success: false, msg: "Failed to fetch products" };
  }
}

/* -----------------------------
   UPDATE ACTIVE STATUS
--------------------------------*/

export async function updateProductActive(_, { productId, isActive }) {
  try {
    if (!productId || typeof isActive !== "boolean") {
      return {
        success: false,
        msg: "Product ID and isActive are required",
      };
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        isActive,
        updatedAt: new Date(),
      },
      include: {
        User: true,
        Brand: true,
      },
    });

    return {
      success: true,
      data: serializeProduct(product),
    };
  } catch (err) {
    console.error("updateProductActive error:", err);
    return {
      success: false,
      msg: "Failed to update product status",
    };
  }
}
export async function updateProductStatus(_, { productId, status }) {
  try {
    if (!productId || !status) {
      return { success: false, msg: "productId and status are required" };
    }

    const isActive = status === "ACTIVE";

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status,
        isActive, // ✅ auto-sync
        updatedAt: new Date(),
      },
      include: {
        User: true,
        Brand: true,
      },
    });

    return {
      success: true,
      data: product,
    };
  } catch (err) {
    console.error("updateProductStatus error:", err);
    return {
      success: false,
      msg: "Failed to update product status",
    };
  }
}
/* -----------------------------
   DELETE PRODUCT (OPTIONAL)
--------------------------------*/

export async function deleteProduct(_, { productId }) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  } catch (err) {
    console.error("deleteProduct error:", err);
    return {
      success: false,
      msg: "Failed to delete product",
    };
  }
}

/* -----------------------------
   UPDATE PRODUCT VARIANT ACTIVE
--------------------------------*/

export async function updateProductVariantActive(_, { variantId, isActive }) {
  try {
    if (!variantId || typeof isActive !== "boolean") {
      return {
        success: false,
        msg: "variantId and isActive are required",
      };
    }

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        isActive,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        id: variant.id,
        isActive: variant.isActive,
        color: variant.color,
        fitType: variant.fitType,
        product: variant.product,
      },
    };
  } catch (err) {
    console.error("updateProductVariantActive error:", err);
    return {
      success: false,
      msg: "Failed to update product variant status",
    };
  }
}
