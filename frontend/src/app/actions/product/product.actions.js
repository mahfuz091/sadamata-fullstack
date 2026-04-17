"use server";

import {
  attachPreviewUrl,
  attachPreviewUrlTwo,
} from "@/lib/attachPreviewUrl.js";
import prisma from "@/lib/prisma";
const SIGN_EXPIRES = 60 * 60;
import {
  PUBLIC_PRODUCT_INCLUDE,
  PUBLIC_PRODUCT_WHERE,
  PUBLIC_VARIANT_WHERE,
} from "@/lib/productQuery";
import { getPrivateUrl } from "@/lib/s3";
// Adjust this path to match your Prisma client output.
// From your schema it looks like: output = "../src/generated/prisma"

/**
 * getProducts(input)
 * Plain JS server action to list products with filters, sorting, pagination,
 * and sales aggregates.
 *
 * @param {Object} input
 * @param {number} [input.page=1]            1-based
 * @param {number} [input.pageSize=20]
 * @param {string} [input.q]                 search in title/description/tags
 * @param {string|null} [input.brandId]
 * @param {string|null} [input.userId]       owner filter
 * @param {boolean|null} [input.isActive]
 * @param {boolean|null} [input.visibility]
 * @param {string[]} [input.fitType]         e.g. ["MEN","WOMEN","YOUTH"]
 * @param {string[]} [input.colors]          e.g. ["black","green"]
 * @param {"newest"|"oldest"|"price_asc"|"price_desc"|"title_asc"|"title_desc"|"best_selling"} [input.sort="newest"]
 */
/** Common include for product cards/lists */

const publicVariantWhere = { isActive: true };
const commonProductInclude = {
  Brand: {
    select: {
      id: true,
      name: true,
      // add more Brand fields if you need them
    },
  },
  User: { select: { id: true, name: true } },
  Mockup: true,
  features: true,
  tags: true,
  variants: {
    where: PUBLIC_VARIANT_WHERE,
  },
};

// export async function getAllProducts({ page = 1, pageSize = 24 } = {}) {
//   const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
//   const take = Math.max(1, pageSize);

//   const where = {
//     isActive: true,
//     visibility: true,
//     // variants: { where: { isActive: true } },
//   }; // tweak if you want to show inactive/hidden too

//   const [total, items] = await Promise.all([
//     prisma.product.count({ where: PUBLIC_PRODUCT_WHERE }),
//     prisma.product.findMany({
//       where: PUBLIC_PRODUCT_WHERE,
//       skip,
//       take,
//       orderBy: { createdAt: "desc" },
//       include: {
//         Brand: {
//           select: {
//             id: true,
//             name: true,
//             // add more Brand fields if you need them
//           },
//         },
//         User: { select: { id: true, name: true } },
//         Mockup: true,
//         features: true,
//         tags: true,
//         variants: {
//           where: PUBLIC_VARIANT_WHERE,
//         },
//       },
//       // ✅ ONLY ACTIVE VARIANTS

//       include: PUBLIC_PRODUCT_INCLUDE,
//     }),
//   ]);

//   return {
//     page,
//     pageSize: take,
//     total,
//     totalPages: Math.max(1, Math.ceil(total / take)),
//     items,
//   };
// }
export async function getAllProducts({ page = 1, pageSize = 24 } = {}) {
  const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const take = Math.max(1, pageSize);

  const [total, items, all] = await Promise.all([
    prisma.product.count({ where: PUBLIC_PRODUCT_WHERE }),
    prisma.product.findMany({
      where: PUBLIC_PRODUCT_WHERE,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: PUBLIC_PRODUCT_INCLUDE, // ✅ use only one include
    }),
    prisma.product.findMany({}),
  ]);

  const itemsWithPreview = await attachPreviewUrl(items);

  return {
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    items: itemsWithPreview,
    all: all,
  };
}

export async function getProducts(input = {}) {
  const {
    page = 1,
    pageSize = 20,
    q,
    brandId = null,
    userId = null,
    isActive = null,
    visibility = null,
    fitType,
    colors,
    sort = "newest",
  } = input;

  // -------------------- Filters --------------------
  const buildQOr = (q) => {
    const raw = q.trim();
    if (!raw) return undefined;

    const alts = Array.from(
      new Set([
        raw,
        raw.replace(/[-_]/g, " "), // t-shirt -> t shirt
        raw.replace(/[^a-z0-9]/gi, ""), // t shirt -> tshirt
        raw.replace(/\s+/g, "-"), // t shirt -> t-shirt
      ]),
    ).filter(Boolean);

    return alts.flatMap((term) => [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { tags: { some: { value: { contains: term, mode: "insensitive" } } } },
    ]);
  };

  const orSearch = q ? buildQOr(q) : undefined;

  // const variantsFilter =
  //   (Array.isArray(fitType) && fitType.length) ||
  //   (Array.isArray(colors) && colors.length)
  //     ? {
  //         some: {
  //           AND: [
  //             Array.isArray(fitType) && fitType.length
  //               ? { fitType: { in: fitType } }
  //               : {},
  //             Array.isArray(colors) && colors.length
  //               ? { color: { in: colors } }
  //               : {},
  //           ],
  //         },
  //       }
  //     : undefined;
  const variantsFilter =
    fitType?.length || colors?.length
      ? {
        some: {
          ...PUBLIC_VARIANT_WHERE,
          ...(fitType?.length && { fitType: { in: fitType } }),
          ...(colors?.length && { color: { in: colors } }),
        },
      }
      : undefined;

  const where = {
    AND: [
      PUBLIC_PRODUCT_WHERE,
      orSearch ? { OR: orSearch } : {},
      variantsFilter ? { variants: variantsFilter } : {},
    ],
  };

  // -------------------- Sorting --------------------
  let orderBy = [{ createdAt: "desc" }];

  switch (sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "price_asc":
      orderBy = [{ price: "asc" }, { createdAt: "desc" }];
      break;
    case "price_desc":
      orderBy = [{ price: "desc" }, { createdAt: "desc" }];
      break;
    case "title_asc":
      orderBy = [{ title: "asc" }];
      break;
    case "title_desc":
      orderBy = [{ title: "desc" }];
      break;
    case "best_selling":
      // Order by number of related sales (Prisma supports relation _count orderBy)
      orderBy = [{ sales: { _count: "desc" } }, { createdAt: "desc" }];
      break;
    default:
      orderBy = [{ createdAt: "desc" }];
  }

  const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const take = Math.max(1, pageSize);

  // -------------------- Query total count --------------------
  const total = await prisma.product.count({ where });

  // -------------------- Fetch page --------------------
  const items = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      Brand: { select: { id: true, name: true } },
      User: { select: { id: true, name: true } },
      Mockup: { select: { id: true, name: true, preview: true } },
      features: { select: { id: true, content: true } },
      tags: { select: { id: true, value: true } },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          color: true,
          fitType: true,
          frontImg: true,
          backImg: true,
        },
      },
      _count: { select: { sales: true } }, // quick count for best_selling and UI
    },
  });

  // -------------------- Sales aggregates (sum of quantity and total) --------------------
  // Get all product IDs on this page, then group sales.
  const productIds = items.map((p) => p.id);
  const grouped = productIds.length
    ? await prisma.sale.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _sum: {
        quantity: true,
        total: true,
        brandEarning: true,
        merchantEarning: true,
        platformEarning: true,
      },
    })
    : [];

  const aggByProduct = new Map();
  for (const g of grouped) {
    aggByProduct.set(g.productId, {
      totalSold: g._sum.quantity || 0,
      grossRevenue: g._sum.total || 0,
      brandEarning: g._sum.brandEarning || 0,
      merchantEarning: g._sum.merchantEarning || 0,
      platformEarning: g._sum.platformEarning || 0,
    });
  }

  const enriched = items.map((p) => ({
    ...p,
    salesAggregates: aggByProduct.get(p.id) || {
      totalSold: 0,
      grossRevenue: 0,
      brandEarning: 0,
      merchantEarning: 0,
      platformEarning: 0,
    },
  }));
  const withImages = await attachPreviewUrl(enriched);

  return {
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    items: withImages,
  };
}

/**
 * Optional helper: lightweight list for dropdowns, no heavy includes.
 */
export async function getProductOptions({ q, limit = 20 } = {}) {
  const where = q
    ? {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { brandName: { contains: q, mode: "insensitive" } },
      ],
    }
    : undefined;

  const rows = await prisma.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: Math.max(1, limit),
    select: {
      id: true,
      title: true,
      brandName: true,
      price: true,
      mockupId: true,
    },
  });

  return rows;
}

/**
 * NEW ARRIVALS
 * Sorted by createdAt DESC, paginated.
 */
export async function getNewArrivals({ page = 1, pageSize = 24 } = {}) {
  const take = Math.max(1, pageSize);
  const skip = (Math.max(1, page) - 1) * take;

  const where = { isActive: true, visibility: true }; // tweak if you want to show inactive/hidden too

  const [total, items] = await Promise.all([
    prisma.product.count({ where: PUBLIC_PRODUCT_WHERE }),
    prisma.product.findMany({
      where: PUBLIC_PRODUCT_WHERE,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: commonProductInclude,
    }),
  ]);

  return {
    kind: "new_arrivals",
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    items: await attachPreviewUrl(items),
  };
}

/**
 * BEST SELLERS
 * Ranked by total quantity sold (sum of Sale.quantity), paginated.
 * If you prefer by number of orders, change to _count instead of _sum.
 */
export async function getBestSellers({ page = 1, pageSize = 24 } = {}) {
  const take = Math.max(1, pageSize);
  const skip = (Math.max(1, page) - 1) * take;
  const productWhere = PUBLIC_PRODUCT_WHERE;
  // 1) Get productIds ordered by total sold
  const totals = await prisma.sale.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
      total: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
    orderBy: { _sum: { quantity: "desc" } },
    skip,
    take,
  });

  const productIds = totals.map((t) => t.productId);

  // Total distinct products that have at least one sale (for pagination)
  const [{ count: totalProductsWithSales }] = await prisma.$queryRawUnsafe(`
    SELECT COUNT(DISTINCT "productId")::int AS count
    FROM "Sale"
  `);

  if (productIds.length === 0) {
    return {
      kind: "best_sellers",
      page,
      pageSize: take,
      total: totalProductsWithSales || 0,
      totalPages: Math.max(1, Math.ceil((totalProductsWithSales || 0) / take)),
      items: [],
    };
  }

  // 2) Fetch those products
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      ...productWhere,
    },
    include: PUBLIC_PRODUCT_INCLUDE,
  });

  // 3) Attach aggregates and preserve ranking order
  const aggMap = new Map(
    totals.map((t) => [
      t.productId,
      {
        totalSold: t._sum.quantity || 0,
        grossRevenue: t._sum.total || 0,
        brandEarning: t._sum.brandEarning || 0,
        merchantEarning: t._sum.merchantEarning || 0,
        platformEarning: t._sum.platformEarning || 0,
      },
    ]),
  );

  const items = productIds
    .map((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return null;
      return {
        ...p,
        salesAggregates: aggMap.get(id) || {
          totalSold: 0,
          grossRevenue: 0,
          brandEarning: 0,
          merchantEarning: 0,
          platformEarning: 0,
        },
      };
    })
    .filter(Boolean);

  return {
    kind: "best_sellers",
    page,
    pageSize: take,
    total: totalProductsWithSales || productIds.length,
    totalPages: Math.max(
      1,
      Math.ceil((totalProductsWithSales || productIds.length) / take),
    ),
    items: await attachPreviewUrl(items),
  };
}

/**
 * FEATURED PRODUCTS
 * Uses a Tag with value 'featured' (case-insensitive) to mark featured items.
 * Adjust if you keep a different convention.
 */
export async function getFeaturedProducts({
  page = 1,
  pageSize = 24,
  featuredTag = "featured",
} = {}) {
  const take = Math.max(1, pageSize);
  const skip = (Math.max(1, page) - 1) * take;

  // const where = {
  //   isActive: true,
  //   visibility: true,
  //   tags: { some: { value: { equals: featuredTag, mode: "insensitive" } } },
  // };
  const where = {
    AND: [
      PUBLIC_PRODUCT_WHERE,
      {
        tags: {
          some: {
            value: { equals: featuredTag, mode: "insensitive" },
          },
        },
      },
    ],
  };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" }, // or random: { orderBy: { id: 'asc' }, then shuffle in JS }
      skip,
      take,
      include: commonProductInclude,
    }),
  ]);

  return {
    kind: "featured",
    page,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    items: await attachPreviewUrl(items),
  };
}
export async function getProductsByProductId(productId) {
  if (!productId) throw new Error("productId is required");

  const product = await prisma.product.findFirst({
    where: {
      productId,
      isActive: true,
      // visibility: true,
      variants: { some: { isActive: true } },
    },
    include: {
      ...PUBLIC_PRODUCT_INCLUDE,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  const [signed] = await attachPreviewUrlTwo(product ? [product] : []);

  if (signed?.reviews?.length) {
    signed.reviews = await Promise.all(
      signed.reviews.map(async (review) => ({
        ...review,
        mediaUrl: review.mediaKey
          ? await getPrivateUrl(review.mediaKey, SIGN_EXPIRES)
          : null,
      }))
    );
  }

  return {
    kind: "product_by_id",
    found: !!product,
    item: signed || null,
  };
}

export async function getProductsByCategorySlug(input = {}) {
  const {
    slug,
    page = 1,
    pageSize = 24,
    q = "",
    brandId = null,
    fitType = [], // ["MEN","WOMEN"]
    colors = [], // ["#000","#fff"]
    sort = "newest", // newest|oldest|price_asc|price_desc|title_asc|title_desc|best_selling
  } = input;

  if (!slug) throw new Error("slug is required");

  // ✅ 1) find category by slug (case-insensitive)
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

  // -------- Search OR --------
  const buildQOr = (text) => {
    const raw = (text || "").trim();
    if (!raw) return undefined;

    const alts = Array.from(
      new Set([
        raw,
        raw.replace(/[-_]/g, " "),
        raw.replace(/[^a-z0-9]/gi, ""),
        raw.replace(/\s+/g, "-"),
      ]),
    ).filter(Boolean);

    return alts.flatMap((term) => [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { tags: { some: { value: { contains: term, mode: "insensitive" } } } },
    ]);
  };

  const orSearch = q ? buildQOr(q) : undefined;

  // -------- Variant filter --------
  const variantsFilter =
    fitType?.length || colors?.length
      ? {
        some: {
          ...PUBLIC_VARIANT_WHERE,
          ...(fitType?.length && { fitType: { in: fitType } }),
          ...(colors?.length && { color: { in: colors } }),
        },
      }
      : { some: { ...PUBLIC_VARIANT_WHERE } }; // ensure at least one active variant

  const selectedBrand = brandId
    ? await prisma.brand.findUnique({
        where: { id: brandId },
        select: { name: true },
      })
    : null;

  const brandFilters = brandId
    ? [
        { brandId },
        selectedBrand?.name
          ? { brandName: { equals: selectedBrand.name, mode: "insensitive" } }
          : null,
      ].filter(Boolean)
    : [];

  // -------- WHERE --------
  const where = {
    AND: [
      PUBLIC_PRODUCT_WHERE,
      // ✅ category match (m:n)
      { categories: { some: { id: category.id } } },
      brandFilters.length ? { OR: brandFilters } : {},
      orSearch ? { OR: orSearch } : {},
      { variants: variantsFilter },
    ],
  };

  // -------- ORDER BY --------
  let orderBy = [{ createdAt: "desc" }];

  switch (sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "price_asc":
      orderBy = [{ price: "asc" }, { createdAt: "desc" }];
      break;
    case "price_desc":
      orderBy = [{ price: "desc" }, { createdAt: "desc" }];
      break;
    case "title_asc":
      orderBy = [{ title: "asc" }];
      break;
    case "title_desc":
      orderBy = [{ title: "desc" }];
      break;
    case "best_selling":
      orderBy = [{ sales: { _count: "desc" } }, { createdAt: "desc" }];
      break;
    default:
      orderBy = [{ createdAt: "desc" }];
  }

  const take = Math.max(1, pageSize);
  const skip = (Math.max(1, page) - 1) * take;

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: PUBLIC_PRODUCT_INCLUDE,
    }),
  ]);

  // ✅ attach previewUrl (signed S3)
  const itemsWithPreview = await attachPreviewUrlTwo(items);
  const totalPages = Math.max(1, Math.ceil(total / take));

  return {
    found: true,
    kind: "category_products",
    category,
    page: Math.max(1, page),
    pageSize: take,
    total,
    totalPages,
    items: itemsWithPreview,
  };

}


export async function getRandomProductsByCategorySlug({ slug, limit = 8 } = {}) {
  if (!slug) throw new Error("slug is required");

  const pageSize = Math.max(1, limit);

  const category = await prisma.productCategory.findFirst({
    where: { slug: { equals: slug, mode: "insensitive" } },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });

  if (!category) {
    return {
      found: false,
      category: null,
      page: 1,
      pageSize,
      total: 0,
      totalPages: 1,
      items: [],
    };
  }

  const seedProducts = await prisma.product.findMany({
    where: {
      AND: [
        PUBLIC_PRODUCT_WHERE,
        { categories: { some: { id: category.id } } },
      ],
    },
    take: 50,
    include: {
      categories: { select: { id: true } },
    },
  });

  const relatedCategoryIds = Array.from(
    new Set([
      category.id,
      ...seedProducts.flatMap((product) =>
        (product.categories || []).map((item) => item.id)
      ),
    ])
  );

  const where = {
    AND: [
      PUBLIC_PRODUCT_WHERE,
      { categories: { some: { id: { in: relatedCategoryIds } } } },
    ],
  };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const randomPage = totalPages > 1 ? Math.floor(Math.random() * totalPages) + 1 : 1;
  const skip = (randomPage - 1) * pageSize;

  const items = await prisma.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    skip,
    take: pageSize * 2,
    include: PUBLIC_PRODUCT_INCLUDE,
  });

  const itemsWithPreview = await attachPreviewUrlTwo(items);

  for (let i = itemsWithPreview.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsWithPreview[i], itemsWithPreview[j]] = [
      itemsWithPreview[j],
      itemsWithPreview[i],
    ];
  }

  return {
    found: true,
    kind: "random_category_products",
    category,
    page: randomPage,
    pageSize,
    total,
    totalPages,
    items: itemsWithPreview.slice(0, pageSize),
  };
}
