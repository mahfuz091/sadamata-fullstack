"use server";

import prisma from "@/lib/prisma";
import { attachPreviewUrl } from "@/lib/attachPreviewUrl.js";
import { PUBLIC_PRODUCT_INCLUDE, PUBLIC_PRODUCT_WHERE } from "@/lib/productQuery";

import { getPrivateUrl } from "@/lib/s3";

/**
 * getBrandById(id)
 * Fetches brand details by brand ID and signs S3 images.
 */
export async function getBrandById(id) {
  if (!id) return null;

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        brandCategory: true,
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (brand) {
      if (brand.bannerImage && !brand.bannerImage.startsWith("http")) {
        brand.bannerImage = await getPrivateUrl(brand.bannerImage);
      }
      if (brand.user?.profileImage && !brand.user.profileImage.startsWith("http")) {
        brand.user.profileImage = await getPrivateUrl(brand.user.profileImage);
      }
    }

    return brand;
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    return null;
  }
}

/**
 * getProductsByBrandId(brandId, options)
 * Fetches products associated with a specific brand.
 */
export async function getProductsByBrandId(brandId, { page = 1, pageSize = 24 } = {}) {
  if (!brandId) return { items: [], total: 0, totalPages: 1 };

  const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const take = Math.max(1, pageSize);

  try {
    const where = {
      ...PUBLIC_PRODUCT_WHERE,
      brandId: brandId,
    };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: PUBLIC_PRODUCT_INCLUDE,
      }),
    ]);

    const itemsWithPreview = await attachPreviewUrl(items);

    return {
      page,
      pageSize: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
      items: itemsWithPreview,
    };
  } catch (error) {
    console.error("Error fetching products by brand ID:", error);
    return { items: [], total: 0, totalPages: 1 };
  }
}
