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

    user: product.user
      ? {
          id: product.user.id,
          name: product.user.name,
          email: product.user.email,
        }
      : null,

    Brand: product.Brand
      ? {
          id: product.Brand.id,
          name: product.Brand.name,
        }
      : null,
  };
}

/* -----------------------------
   GET PRODUCTS (TABLE)
--------------------------------*/

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: products.map(serializeProduct),
    };
  } catch (err) {
    console.error("getProducts error:", err);
    return {
      success: false,
      msg: "Failed to fetch products",
    };
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
