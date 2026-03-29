"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Assign a ProductCategory to a Brand.
 * brandId here is the Brand.id (not User.id).
 */
export async function assignProductCategoryToBrand(brandId, categoryId) {
  if (!brandId || !categoryId) {
    return { success: false, message: "Brand ID and Category ID are required" };
  }

  try {
    // Update the brand with the new category
    await prisma.brand.update({
      where: { id: brandId },
      data: { productCategoryId: categoryId },
    });

    // Revalidate the cache for the brands dashboard
    revalidatePath(`/dashboard/brands`);
    return { success: true };
  } catch (error) {
    console.error("assignProductCategoryToBrand error:", error);
    return { success: false, message: "Failed to assign category" };
  }
}

/**
 * Remove the ProductCategory from a Brand (set to null).
 */
export async function removeProductCategoryFromBrand(brandId) {
  if (!brandId) {
    return { success: false, message: "Brand ID is required" };
  }

  try {
    // Remove the category by setting productCategoryId to null
    await prisma.brand.update({
      where: { id: brandId },
      data: { productCategoryId: null },
    });

    // Revalidate the cache for the brands dashboard
    revalidatePath(`/dashboard/brands`);
    return { success: true };
  } catch (error) {
    console.error("removeProductCategoryFromBrand error:", error);
    return { success: false, message: "Failed to remove category" };
  }
}
