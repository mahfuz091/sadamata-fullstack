"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ----------------------------------------
   CREATE CATEGORY
---------------------------------------- */
export async function createProductCategory(name) {
  if (!name || !name.trim()) {
    return { success: false, message: "Category name is required" };
  }

  try {
    const category = await prisma.productCategory.create({
      data: {
        name: name.trim(),
      },
    });

    revalidatePath("/dashboard/product-categories");

    return { success: true, data: category };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, message: "Category already exists" };
    }

    console.log(error);

    return { success: false, message: "Failed to create category" };
  }
}

/* ----------------------------------------
   GET ALL CATEGORIES
---------------------------------------- */
export async function getAllProductCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/* ----------------------------------------
   GET CATEGORY BY ID
---------------------------------------- */
export async function getProductCategoryById(id) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, message: "Category not found" };
    }

    return { success: true, data: category };
  } catch (error) {
    return { success: false, message: "Failed to fetch category" };
  }
}

/* ----------------------------------------
   UPDATE CATEGORY
---------------------------------------- */
export async function updateProductCategory(id, name) {
  if (!name || !name.trim()) {
    return { success: false, message: "Category name is required" };
  }

  try {
    const updatedCategory = await prisma.productCategory.update({
      where: { id },
      data: { name: name.trim() },
    });

    revalidatePath("/admin/categories");

    return { success: true, data: updatedCategory };
  } catch (error) {
    return { success: false, message: "Failed to update category" };
  }
}

/* ----------------------------------------
   DELETE CATEGORY
---------------------------------------- */
export async function deleteProductCategory(id) {
  try {
    await prisma.productCategory.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Cannot delete category. It may be linked to existing products.",
    };
  }
}

/* ----------------------------------------
   ATTACH CATEGORY TO PRODUCT
---------------------------------------- */
export async function attachCategoryToProduct(productId, categoryId) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        categories: {
          connect: { id: categoryId },
        },
      },
    });

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to attach category" };
  }
}

/* ----------------------------------------
   REMOVE CATEGORY FROM PRODUCT
---------------------------------------- */
export async function removeCategoryFromProduct(productId, categoryId) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        categories: {
          disconnect: { id: categoryId },
        },
      },
    });

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to remove category" };
  }
}
