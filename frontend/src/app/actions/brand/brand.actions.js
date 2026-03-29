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



const PUBLIC_BRAND_WHERE = {
  isActive: true,
};

const PUBLIC_BRAND_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
  },
  ProductCategory: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  _count: {
    select: {
      Product: true,
    },
  },
};


// export async function getBrandsByCategorySlug(input = {}) {
//   const {
//     slug,
//     page = 1,
//     pageSize = 24,
//     q = "",
//     sort = "newest", // newest|oldest|name_asc|name_desc
//   } = input;

//   if (!slug) throw new Error("slug is required");

//   // 1) find category by slug (case-insensitive)
//   const category = await prisma.productCategory.findFirst({
//     where: {
//       slug: { equals: slug, mode: "insensitive" },
//     },
//     select: { id: true, name: true, slug: true, sortOrder: true },
//   });

//   if (!category) {
//     return {
//       found: false,
//       category: null,
//       items: [],
//       page,
//       pageSize,
//       total: 0,
//       totalPages: 1,
//     };
//   }

//   // -------- Search OR --------
//   const buildQOr = (text) => {
//     const raw = (text || "").trim();
//     if (!raw) return undefined;

//     const alts = Array.from(
//       new Set([
//         raw,
//         raw.replace(/[-_]/g, " "),
//         raw.replace(/[^a-z0-9]/gi, ""),
//         raw.replace(/\s+/g, "-"),
//       ])
//     ).filter(Boolean);

//     return alts.flatMap((term) => [
//       { name: { contains: term, mode: "insensitive" } },
//       { contactEmail: { contains: term, mode: "insensitive" } },
//       { contactPhone: { contains: term, mode: "insensitive" } },
//       { industryType: { contains: term, mode: "insensitive" } },
//       { message: { contains: term, mode: "insensitive" } },
//       { websiteUrl: { contains: term, mode: "insensitive" } },
//       { socialProfile: { contains: term, mode: "insensitive" } },
//     ]);
//   };

//   const orSearch = q ? buildQOr(q) : undefined;

//   // -------- WHERE --------
//   const where = {
//     AND: [
//       PUBLIC_BRAND_WHERE,
//       { productCategoryId: category.id },
//       ...(orSearch ? [{ OR: orSearch }] : []),
//     ],
//   };

//   // -------- ORDER BY --------
//   let orderBy = [{ createdAt: "desc" }];

//   switch (sort) {
//     case "oldest":
//       orderBy = [{ createdAt: "asc" }];
//       break;
//     case "name_asc":
//       orderBy = [{ name: "asc" }];
//       break;
//     case "name_desc":
//       orderBy = [{ name: "desc" }];
//       break;
//     default:
//       orderBy = [{ createdAt: "desc" }];
//   }

//   const take = Math.max(1, pageSize);
//   const skip = (Math.max(1, page) - 1) * take;

//   const [total, items] = await Promise.all([
//     prisma.brand.count({ where }),
//     prisma.brand.findMany({
//       where,
//       orderBy,
//       skip,
//       take,
//       include: PUBLIC_BRAND_INCLUDE,
//     }),
//   ]);

//   return {
//     found: true,
//     kind: "category_brands",
//     category,
//     page,
//     pageSize: take,
//     total,
//     totalPages: Math.max(1, Math.ceil(total / take)),
//     items,
//   };
// }

const SIGN_EXPIRES = 60 * 60;

export async function getBrandsByCategorySlug(input = {}) {
  const {
    slug,
    page = 1,
    pageSize = 24,
    q = "",
    sort = "newest",
  } = input;

  if (!slug) throw new Error("slug is required");

  const category = await prisma.productCategory.findFirst({
    where: {
      slug: { equals: slug, mode: "insensitive" },
    },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });

  if (!category) {
    return {
      found: false,
      category: null,
      items: [],
      page,
      pageSize,
      total: 0,
      totalPages: 1,
    };
  }

  const buildQOr = (text) => {
    const raw = (text || "").trim();
    if (!raw) return undefined;

    const alts = Array.from(
      new Set([
        raw,
        raw.replace(/[-_]/g, " "),
        raw.replace(/[^a-z0-9]/gi, ""),
        raw.replace(/\s+/g, "-"),
      ])
    ).filter(Boolean);

    return alts.flatMap((term) => [
      { name: { contains: term, mode: "insensitive" } },
      { contactEmail: { contains: term, mode: "insensitive" } },
      { contactPhone: { contains: term, mode: "insensitive" } },
      { industryType: { contains: term, mode: "insensitive" } },
      { socialProfile: { contains: term, mode: "insensitive" } },
      { websiteUrl: { contains: term, mode: "insensitive" } },
      { message: { contains: term, mode: "insensitive" } },
      { user: { name: { contains: term, mode: "insensitive" } } },
    ]);
  };

  const orSearch = q ? buildQOr(q) : undefined;

  const where = {
    AND: [
      { isActive: true },
      { productCategoryId: category.id },
      ...(orSearch ? [{ OR: orSearch }] : []),
    ],
  };

  let orderBy = [{ createdAt: "desc" }];

  switch (sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "name_asc":
      orderBy = [{ name: "asc" }];
      break;
    case "name_desc":
      orderBy = [{ name: "desc" }];
      break;
    default:
      orderBy = [{ createdAt: "desc" }];
  }

  const take = Math.max(1, pageSize);
  const skip = (Math.max(1, page) - 1) * take;

  const [total, items] = await Promise.all([
    prisma.brand.count({ where }),
    prisma.brand.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        ProductCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            Product: true,
            followers: true,
          },
        },
      },
    }),
  ]);

  const itemsWithSignedImages = await Promise.all(
    items.map(async (brand) => {
      const bannerImageUrl = brand.bannerImage
        ? await getPrivateUrl(brand.bannerImage, SIGN_EXPIRES)
        : null;

      const profileImageUrl = brand.user?.profileImage
        ? await getPrivateUrl(brand.user.profileImage, SIGN_EXPIRES)
        : null;

      const previewUrl = bannerImageUrl || profileImageUrl || null;

      return {
        ...brand,
        bannerImageUrl,
        profileImageUrl,
        previewUrl,
      };
    })
  );

  return {
    found: true,
    kind: "category_brands",
    category,
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    items: itemsWithSignedImages,
  };
}
