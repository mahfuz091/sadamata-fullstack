"use server";
import prisma from "@/lib/prisma";
import { FitType } from "@/generated/prisma"; // adjust if needed
import { getPrivateUrl } from "@/lib/s3";
// --- add this helper inside the same file ---
const attachVariantUrls = async (products) => {
  // Flatten all frontImg keys, resolve in one batch, then redistribute
  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v, vi) => ({ pi: p.id, vi, key: v.frontImg }))
  );

  const urlMap = new Map();
  await Promise.all(
    allVariants
      .filter((x) => x.key)
      .map(async (x) => {
        if (!urlMap.has(x.key)) {
          urlMap.set(x.key, await getPrivateUrl(x.key));
        }
      })
  );

  return products.map((p) => ({
    ...p,
    variants: (p.variants || []).map((v) => ({
      ...v,
      frontImgUrl: v.frontImg ? (urlMap.get(v.frontImg) ?? null) : null,
      backImgUrl: null, // not needed in search results
    })),
  }));
};

export async function searchProducts(input) {
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
  const slug = params.slug?.toString().trim() || null;
  const brandId = params.brandId?.toString() || null;

  const minPrice = toNum(params.minPrice);
  const maxPrice = toNum(params.maxPrice);

  const color = params.color?.toString().trim() || null;

  const fitTypeRaw = params.fitType?.toString().trim() || null;
  const fitType = fitTypeRaw ? FitType[fitTypeRaw.toUpperCase()] ?? null : null;

  const tag = params.tag?.toString().trim() || null;

  const sort = params.sort?.toString() || "relevance";

  const pageSizeRaw = toNum(params.pageSize ?? params.take) ?? 12;
  const pageSize = Math.max(1, Math.min(pageSizeRaw, 60));

  // cursor
  let cursor = null;
  try {
    cursor =
      typeof params.cursor === "string"
        ? JSON.parse(params.cursor)
        : params.cursor;
  } catch {
    cursor = null;
  }

  // -------------------------
  // STRICT SEARCH helpers
  // -------------------------
  const STOPWORDS = new Set([
    "i",
    "im",
    "am",
    "my",
    "me",
    "we",
    "our",
    "you",
    "your",
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "this",
    "that",
    "it",
    "is",
    "are",
    "was",
    "were",
    // clothing noise:
    // "t",
    // "tee",
    // "shirt",
    // "tshirt",
    // "t-shirts",
    // "t-shirt",
    // "shirts",
  ]);

  const tokenize = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2)
      .filter((w) => !STOPWORDS.has(w));

  // Build AND groups: require at least N tokens matched
  // We do: OR of (AND token combos) like: (t1 AND t2) OR (t1 AND t3) OR (t2 AND t3)
  const buildMinMatchOr = (tokens, minMatch = 2) => {
    const t = [...new Set(tokens)].slice(0, 5); // cap at 5 → max C(5,3)=10 combos
    if (!t.length) return null;

    const m = Math.min(minMatch, t.length);

    // generate combinations of size m (simple recursive)
    const combos = [];
    const rec = (start, cur) => {
      if (cur.length === m) {
        combos.push([...cur]);
        return;
      }
      for (let i = start; i < t.length; i++) {
        cur.push(t[i]);
        rec(i + 1, cur);
        cur.pop();
      }
    };
    rec(0, []);

    const tokenWhere = (token) => ({
      OR: [
        { title: { contains: token, mode: "insensitive" } },
        // description excluded — ILIKE on long text = full table scan
        { tags: { some: { value: { contains: token, mode: "insensitive" } } } },
        { Brand: { is: { name: { contains: token, mode: "insensitive" } } } },
        { Mockup: { is: { name: { contains: token, mode: "insensitive" } } } },
        { categories: { some: { name: { contains: token, mode: "insensitive" } } } },
        { brandName: { contains: token, mode: "insensitive" } },
      ],
    });

    // OR over combos; each combo is AND of tokens
    return combos.map((combo) => ({
      AND: combo.map((tk) => tokenWhere(tk)),
    }));
  };

  // lightweight scoring (client-side after fetch)
  const scoreProduct = (p, tokens) => {
    const hay = [
      p.title,
      p.description || "",
      p.Brand?.name || "",
      p.brandName || "",
      p.Mockup?.name || "",
      ...(p.categories?.map((x) => x.name) || []),
      ...(p.tags?.map((x) => x.value) || []),
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const tk of tokens) {
      if (hay.includes(tk)) score += 1;
    }

    // boost exact-ish title contains
    const title = (p.title || "").toLowerCase();
    if (tokens.length && tokens.every((tk) => title.includes(tk))) score += 3;

    return score;
  };

  // -------------------------
  // Base filters (public)
  // -------------------------
  const activeVariantWhere = { isActive: true };

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

  const baseWhere = {
    isActive: true,
    visibility: true,
    AND: [
      { variants: { some: activeVariantWhere } },
      slug
        ? { Mockup: { is: { name: { contains: slug, mode: "insensitive" } } } }
        : null,
      brandFilters.length ? { OR: brandFilters } : null,
      minPrice != null ? { price: { gte: minPrice } } : null,
      maxPrice != null ? { price: { lte: maxPrice } } : null,
      color
        ? {
            variants: {
              some: {
                ...activeVariantWhere,
                color: { contains: color, mode: "insensitive" },
              },
            },
          }
        : null,
      fitType ? { variants: { some: { ...activeVariantWhere, fitType } } } : null,
      tag
        ? { tags: { some: { value: { contains: tag, mode: "insensitive" } } } }
        : null,
    ].filter(Boolean),
  };

  const include = {
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
    categories: { select: { id: true, name: true, slug: true } },
  };

  // -------------------------
  // Cursor fallback (keep stable)
  // -------------------------
  if (cursor?.id) {
    let orderBy = [{ createdAt: "desc" }, { id: "desc" }];
    if (sort === "price_asc") orderBy = [{ price: "asc" }, { id: "desc" }];
    if (sort === "price_desc") orderBy = [{ price: "desc" }, { id: "desc" }];
    if (sort === "oldest") orderBy = [{ createdAt: "asc" }, { id: "asc" }];

    const cursorWhere = (() => {
      if (!cursor?.id) return null;

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

      return { id: { lt: cursor.id } };
    })();

    const tokens = tokenize(q || "");
    const minMatch = tokens.length >= 4 ? 3 : tokens.length >= 2 ? 2 : 1;
    const deepOr = q ? buildMinMatchOr(tokens, minMatch) : null;
    const qTrimCursor = q?.trim();
    const rawOrCursor = qTrimCursor
      ? [
          { title: { contains: qTrimCursor, mode: "insensitive" } },
          { tags: { some: { value: { contains: qTrimCursor, mode: "insensitive" } } } },
          { Brand: { is: { name: { contains: qTrimCursor, mode: "insensitive" } } } },
          { Mockup: { is: { name: { contains: qTrimCursor, mode: "insensitive" } } } },
          { categories: { some: { name: { contains: qTrimCursor, mode: "insensitive" } } } },
          { brandName: { contains: qTrimCursor, mode: "insensitive" } },
        ]
      : null;
    const combinedOrCursor = q
      ? [...(deepOr || []), ...(rawOrCursor || [])]
      : null;

    const where = q
      ? {
          ...baseWhere,
          AND: [
            ...baseWhere.AND,
            combinedOrCursor && combinedOrCursor.length
              ? { OR: combinedOrCursor }
              : null,
          ].filter(Boolean),
        }
      : baseWhere;

    const finalWhere = cursorWhere ? { AND: [where, cursorWhere] } : where;

    const products = await prisma.product.findMany({
      where: finalWhere,
      orderBy,
      take: pageSize + 1,
      include,
    });

    const hasMore = products.length > pageSize;
    const sliced = hasMore ? products.slice(0, pageSize) : products;
    const slicedWithUrls = await attachVariantUrls(sliced);

    const items = slicedWithUrls.map((p) => ({
      id: p.id,
      productId: p.productId,
      title: p.title,
      description: p.description,
      price: p.price,
      brandId: p.brandId ?? null,
      brandName: p.Brand?.name ?? p.brandName ?? null,
      mockupName: p.Mockup?.name ?? null,
      visibility: p.visibility,
      variants: p.variants.map((v) => ({
        color: v.color,
        fitType: v.fitType,
        frontImg: v.frontImg,
        backImg: v.backImg,
        frontImgUrl: v.frontImgUrl,
        backImgUrl: v.backImgUrl,
        isActive: v.isActive,
      })),
      tags: p.tags.map((t) => t.value),
    }));

    const last = sliced[sliced.length - 1];
    const nextCursor = last ? { id: last.id, createdAt: last.createdAt } : null;

    return { items, hasMore, nextCursor, pageSize };
  }

  // -------------------------
  // ✅ Deep relevance mode (no cursor)
  // -------------------------
  const qTrim = q?.trim();
  const tokens = tokenize(qTrim || "");
  const minMatch = tokens.length >= 4 ? 3 : tokens.length >= 2 ? 2 : 1;

  // raw whole-string contains across same fields — guarantees parity with suggest API,
  // and recovers queries that tokenize to nothing (e.g. non-Latin scripts, symbols)
  const rawOr = qTrim
    ? [
        { title: { contains: qTrim, mode: "insensitive" } },
        { tags: { some: { value: { contains: qTrim, mode: "insensitive" } } } },
        { Brand: { is: { name: { contains: qTrim, mode: "insensitive" } } } },
        { Mockup: { is: { name: { contains: qTrim, mode: "insensitive" } } } },
        { categories: { some: { name: { contains: qTrim, mode: "insensitive" } } } },
        { brandName: { contains: qTrim, mode: "insensitive" } },
      ]
    : null;

  // 1) exact title match (best)
  const exactProducts = qTrim
    ? await prisma.product.findMany({
        where: {
          ...baseWhere,
          title: { equals: qTrim, mode: "insensitive" },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: pageSize,
        include,
      })
    : [];

  const exactIds = exactProducts.map((p) => p.id);

  // 2) deep similar match — combine token AND-combos with raw whole-string OR
  const deepOr = qTrim ? buildMinMatchOr(tokens, minMatch) : null;
  const combinedOr = qTrim
    ? [...(deepOr || []), ...(rawOr || [])]
    : null;

  // fetch a bit more, then score/sort in JS
  const candidateProducts = qTrim
    ? await prisma.product.findMany({
        where: {
          ...baseWhere,
          AND: [
            ...baseWhere.AND,
            { id: { notIn: exactIds } },
            combinedOr && combinedOr.length ? { OR: combinedOr } : null,
          ].filter(Boolean),
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: pageSize + 12,
        include,
      })
    : await prisma.product.findMany({
        where: baseWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: pageSize,
        include,
      });

  const qLower = (qTrim || "").toLowerCase();
  const similarProducts = qTrim
    ? candidateProducts
        .map((p) => {
          let s = scoreProduct(p, tokens);
          const hay = [
            p.title,
            p.Brand?.name || "",
            p.brandName || "",
            p.Mockup?.name || "",
            ...(p.categories?.map((x) => x.name) || []),
            ...(p.tags?.map((x) => x.value) || []),
          ]
            .join(" ")
            .toLowerCase();
          if (qLower && hay.includes(qLower)) s += 2;
          return { p, s };
        })
        .filter((x) => x.s >= 1)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p)
    : candidateProducts;

  // merge: exact first, then best similar
  const merged = [...exactProducts, ...similarProducts];

  const hasMore = merged.length > pageSize;
  const sliced = hasMore ? merged.slice(0, pageSize) : merged;

  const slicedWithUrls = await attachVariantUrls(sliced);

  const items = slicedWithUrls.map((p) => ({
    id: p.id,
    productId: p.productId,
    title: p.title,
    description: p.description,
    price: p.price,
    brandId: p.brandId ?? null,
    brandName: p.Brand?.name ?? p.brandName ?? null,
    mockupName: p.Mockup?.name ?? null,
    visibility: p.visibility,
    variants: p.variants.map((v) => ({
      color: v.color,
      fitType: v.fitType,
      frontImg: v.frontImg,
      backImg: v.backImg,
      frontImgUrl: v.frontImgUrl,
      backImgUrl: v.backImgUrl,
      isActive: v.isActive,
    })),
    tags: p.tags.map((t) => t.value),
  }));

  const last = sliced[sliced.length - 1];
  const nextCursor = last ? { id: last.id, createdAt: last.createdAt } : null;

  return { items, hasMore, nextCursor, pageSize };
}
