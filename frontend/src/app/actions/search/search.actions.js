// =============================
// app/search/actions.js (no Zod)
// =============================
"use server";

import { FitType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

/**
 * Accepts: { q, slug, brandId, minPrice, maxPrice, color, fitType, tag, page, pageSize, sort }
 * - slug maps to Mockup.name (case-insensitive match)
 */
// export async function searchProducts(input) {
//   const params = input instanceof FormData ? Object.fromEntries(input.entries()) : (input || {})

//   // --- parse numbers sanely ---
//   const n = (x) => {
//     const v = Number(x)
//     return Number.isFinite(v) ? v : null
//   }

//   const page = n(params.page) && n(params.page) > 0 ? n(params.page) : 1
//   const pageSize = n(params.pageSize) && n(params.pageSize) > 0 ? Math.min(n(params.pageSize), 100) : 12
//   const skip = (page - 1) * pageSize
//   const take = pageSize

//   const q = params.q?.toString().trim() || null
//   const slug = params.slug?.toString().trim() || null // Mockup.name
//   const brandId = params.brandId?.toString() || null
//   const minPrice = n(params.minPrice)
//   const maxPrice = n(params.maxPrice)
//   const color = params.color?.toString().trim() || null
//   const fitType = params.fitType?.toString() || null
//   const tag = params.tag?.toString().trim() || null
//   const sort = params.sort?.toString() || 'relevance'

//   // --- where builder ---
//   const where = {
//     isActive: true,
//     visibility: true,
//     AND: [
//       q
//         ? {
//             OR: [
//               { title:       { contains: q, mode: 'insensitive' } },
//               { description: { contains: q, mode: 'insensitive' } },
//               { tags:   { some: { value: { contains: q, mode: 'insensitive' } } } },
//               { Brand:  { is: { name:  { contains: q, mode: 'insensitive' } } } },
//               { Mockup: { is: { name:  { contains: q, mode: 'insensitive' } } } },
//                { brandName:   { contains: q, mode: 'insensitive' } },
//             ],
//           }
//         : null,
//       // slug maps to Mockup.name (case-insensitive)
//       slug ? { Mockup: { is: { name: { contains: slug, mode: 'insensitive' } } } } : null,
//       brandId ? { brandId } : null,
//       minPrice != null ? { price: { gte: minPrice } } : null,
//       maxPrice != null ? { price: { lte: maxPrice } } : null,
//       // exact color but case-insensitive → use contains-insensitive to avoid equals-mode limitation
//       color ? { variants: { some: { color: { contains: color, mode: 'insensitive' } } } } : null,
//       fitType ? { variants: { some: { fitType } } } : null,
//       // exact tag but case-insensitive → same trick with contains-insensitive
//       tag ? { tags: { some: { value: { contains: tag, mode: 'insensitive' } } } } : null,
//     ].filter(Boolean),
//   }

//   // --- sort ---
//   let orderBy
//   switch (sort) {
//     case 'newest':
//       orderBy = { createdAt: 'desc' }
//       break
//     case 'price_asc':
//       orderBy = { price: 'asc' }
//       break
//     case 'price_desc':
//       orderBy = { price: 'desc' }
//       break
//     default:
//       // pseudo “relevance”: newest-first fallback
//       orderBy = [{ createdAt: 'desc' }]
//   }

//   const [total, products] = await prisma.$transaction([
//     prisma.product.count({ where }),
//     prisma.product.findMany({
//       where,
//       orderBy,
//       skip,
//       take,
//       include: {
//         Brand:   { select: { id: true, name: true } },
//         Mockup:  { select: { id: true, name: true } },
//         variants:{ select: { color: true, fitType: true, frontImg: true, backImg: true } },
//         tags:    { select: { value: true } },
//       },
//     }),
//   ])

//   const items = products.map((p) => ({
//     id: p.id,
//     productId: p.productId,
//     title: p.title,
//     description: p.description,
//     price: p.price,
//     brandId: p.brandId ?? null,
//     brandName: p.Brand?.name ?? p.brandName ?? null,
//     mockupName: p.Mockup?.name ?? null,
//     isActive: p.isActive,
//     visibility: p.visibility,
//     variants: p.variants.map((v) => ({
//       color: v.color,
//       fitType: v.fitType,
//       frontImg: v.frontImg,
//       backImg: v.backImg,
//     })),
//     tags: p.tags.map((t) => t.value),
//   }))

//   return { items, total, page, pageSize }
// }

export async function searchProducts(input) {
  const distinctFits = await prisma.productVariant.findMany({
    distinct: ["fitType"],
    select: { fitType: true },
  });
  console.log("DISTINCT FIT TYPES:", distinctFits);

  const params =
    input instanceof FormData
      ? Object.fromEntries(input.entries())
      : input || {};

  const toNum = (x) => {
    if (x === null || x === undefined || x === "") return null;
    const v = Number(x);
    return Number.isFinite(v) ? v : null;
  };
  const q = params.q?.toString().trim() || null;
  const slug = params.slug?.toString().trim() || null; // Mockup.name
  const brandId = params.brandId?.toString() || null;

  const minPrice = toNum(params.minPrice);
  const maxPrice = toNum(params.maxPrice);

  const color = params.color?.toString().trim() || null;
  const fitTypeRaw = params.fitType?.toString().trim() || null;
  const fitType = fitTypeRaw ? FitType[fitTypeRaw.toUpperCase()] ?? null : null;

  console.log("FIT:", fitType);

  // const fitType = params.fitType?.toString().trim() || null;
  const tag = params.tag?.toString().trim() || null;

  const sort = params.sort?.toString() || "newest";

  // pageSize (take)
  const pageSizeRaw = toNum(params.pageSize ?? params.take) ?? 12;
  const pageSize = Math.max(1, Math.min(pageSizeRaw, 60)); // cap for safety

  // cursor: allow either JSON string or object
  // expected: { createdAt, id }
  let cursor = null;
  try {
    cursor =
      typeof params.cursor === "string"
        ? JSON.parse(params.cursor)
        : params.cursor;
  } catch {
    cursor = null;
  }

  // ---------- hyphen-safe search ----------
  const buildQOr = (qq) => {
    const raw = qq?.trim();
    if (!raw) return null;

    const rawNorm = raw.toLowerCase().replace(/[^a-z0-9]/g, "");

    const alts = new Set([
      raw,
      raw.replace(/[-_]/g, " "),
      raw.replace(/\s+/g, "-"),
      rawNorm,
    ]);

    // common compact words → expand
    if (rawNorm === "tshirt") {
      alts.add("t-shirt");
      alts.add("t shirt");
      alts.add("tee shirt");
    }

    const terms = Array.from(alts).filter(Boolean);

    return terms.flatMap((term) => [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { tags: { some: { value: { contains: term, mode: "insensitive" } } } },
      { Brand: { is: { name: { contains: term, mode: "insensitive" } } } },
      { Mockup: { is: { name: { contains: term, mode: "insensitive" } } } },
      { brandName: { contains: term, mode: "insensitive" } },
    ]);
  };

  const qOr = q ? buildQOr(q) : null;
  const activeVariantWhere = {
    OR: [{ isActive: true }, { isActive: null }],
  };

  // ---------- WHERE ----------
  // IMPORTANT: these will hide drafts (as you wanted for public)
  const where = {
    isActive: true,
    visibility: true,
    AND: [
      // { variants: { some: { isActive: true } } },
      { variants: { some: activeVariantWhere } },
      qOr ? { OR: qOr } : null,

      slug
        ? { Mockup: { is: { name: { contains: slug, mode: "insensitive" } } } }
        : null,

      brandId ? { brandId } : null,

      minPrice != null ? { price: { gte: minPrice } } : null,
      maxPrice != null ? { price: { lte: maxPrice } } : null,

      color
        ? {
            variants: {
              some: { color: { contains: color, mode: "insensitive" } },
            },
          }
        : null,

      // fitType ? { variants: { some: { fitType } } } : null,
      fitType
        ? {
            variants: {
              some: {
                fitType: fitType, // MEN/WOMEN/YOUTH
              },
            },
          }
        : null,

      tag
        ? { tags: { some: { value: { contains: tag, mode: "insensitive" } } } }
        : null,
    ].filter(Boolean),
  };
  if (fitType) {
    const productCount = await prisma.product.count({
      where: {
        isActive: true,
        visibility: true,
        AND: [
          { variants: { some: { isActive: true } } },
          { variants: { some: { isActive: true, fitType } } },
          qOr ? { OR: qOr } : null,
          slug
            ? {
                Mockup: {
                  is: { name: { contains: slug, mode: "insensitive" } },
                },
              }
            : null,
          brandId ? { brandId } : null,
          minPrice != null ? { price: { gte: minPrice } } : null,
          maxPrice != null ? { price: { lte: maxPrice } } : null,
        ].filter(Boolean),
      },
    });

    console.log("DEBUG productCount with fitType", fitType, "=>", productCount);
  }

  console.log("FIT:", fitType);
  const hit = await prisma.product.count({ where });
  console.log("COUNT:", hit);

  // ---------- ORDER BY ----------
  // For cursor paging, ALWAYS include a stable tiebreaker (id)
  // Default newest
  let orderBy = [{ createdAt: "desc" }, { id: "desc" }];

  if (sort === "price_asc") orderBy = [{ price: "asc" }, { id: "desc" }];
  if (sort === "price_desc") orderBy = [{ price: "desc" }, { id: "desc" }];
  if (sort === "oldest") orderBy = [{ createdAt: "asc" }, { id: "asc" }];

  // ---------- CURSOR FILTER ----------
  // Prisma cursor works well when your orderBy starts with unique field.
  // Here we use a WHERE-based keyset for (createdAt,id) ordering (newest/oldest),
  // and for price sorts we do a simpler cursor by id only (less ideal but stable).
  const cursorWhere = (() => {
    if (!cursor?.id) return null;

    // createdAt cursor only works if cursor.createdAt exists
    if (
      (sort === "newest" || sort === "relevance" || !sort) &&
      cursor.createdAt
    ) {
      const cAt = new Date(cursor.createdAt);
      return {
        OR: [
          { createdAt: { lt: cAt } },
          { AND: [{ createdAt: cAt }, { id: { lt: cursor.id } }] },
        ],
      };
    }

    if (sort === "oldest" && cursor.createdAt) {
      const cAt = new Date(cursor.createdAt);
      return {
        OR: [
          { createdAt: { gt: cAt } },
          { AND: [{ createdAt: cAt }, { id: { gt: cursor.id } }] },
        ],
      };
    }

    // For price sorts (asc/desc), better cursor needs (price,id). We’ll do id-only fallback:
    return { id: { lt: cursor.id } };
  })();

  const finalWhere = cursorWhere ? { AND: [where, cursorWhere] } : where;

  //

  // ---------- FETCH (take+1 for hasMore) ----------
  const products = await prisma.product.findMany({
    where: finalWhere,
    orderBy,
    take: pageSize + 1, // one extra
    include: {
      Brand: { select: { id: true, name: true } },
      Mockup: { select: { id: true, name: true } },
      variants: {
        where: activeVariantWhere,
        select: {
          color: true,
          fitType: true,
          frontImg: true,
          backImg: true,
          isActive: true,
        },
      },
      tags: { select: { value: true } },
    },
  });

  const hasMore = products.length > pageSize;
  const sliced = hasMore ? products.slice(0, pageSize) : products;

  const items = sliced.map((p) => ({
    id: p.id,
    productId: p.productId,
    title: p.title,
    description: p.description,
    price: p.price,
    brandId: p.brandId ?? null,
    brandName: p.Brand?.name ?? p.brandName ?? null,
    mockupName: p.Mockup?.name ?? null,
    // isActive: p.isActive,
    visibility: p.visibility,
    variants: p.variants.map((v) => ({
      color: v.color,
      fitType: v.fitType,
      frontImg: v.frontImg,
      backImg: v.backImg,
      isActive: v.isActive,
    })),
    tags: p.tags.map((t) => t.value),
  }));

  const last = sliced[sliced.length - 1];
  const nextCursor = last ? { id: last.id, createdAt: last.createdAt } : null;

  return {
    items,
    hasMore,
    nextCursor,
    pageSize,
  };
}
