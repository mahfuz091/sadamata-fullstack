"use server";
import prisma from "@/lib/prisma";
import { FitType } from "@/generated/prisma"; // adjust if needed
import { getPrivateUrl } from "@/lib/s3";
// --- add this helper inside the same file ---
const attachVariantUrls = async (products) => {
  return await Promise.all(
    products.map(async (p) => {
      const variants = await Promise.all(
        (p.variants || []).map(async (v) => {
          const frontImgUrl = v.frontImg
            ? await getPrivateUrl(v.frontImg)
            : null;
          const backImgUrl = v.backImg ? await getPrivateUrl(v.backImg) : null;

          return {
            ...v,
            frontImgUrl, // ✅ signed url
            backImgUrl, // ✅ signed url
          };
        })
      );

      return { ...p, variants };
    })
  );
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
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2)
      .filter((w) => !STOPWORDS.has(w));

  // Build AND groups: require at least N tokens matched
  // We do: OR of (AND token combos) like: (t1 AND t2) OR (t1 AND t3) OR (t2 AND t3)
  const buildMinMatchOr = (tokens, minMatch = 2) => {
    const t = [...new Set(tokens)].slice(0, 8); // keep it small
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
        { description: { contains: token, mode: "insensitive" } },
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

    const where = q
      ? {
          ...baseWhere,
          AND: [...baseWhere.AND, deepOr ? { OR: deepOr } : null].filter(
            Boolean
          ),
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

  // 2) deep similar match (requires minMatch tokens)
  const deepOr = qTrim ? buildMinMatchOr(tokens, minMatch) : null;

  // fetch a bit more, then score/sort in JS
  const candidateProducts = qTrim
    ? await prisma.product.findMany({
        where: {
          ...baseWhere,
          AND: [
            ...baseWhere.AND,
            { id: { notIn: exactIds } },
            deepOr ? { OR: deepOr } : null,
          ].filter(Boolean),
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: pageSize * 3, // candidates for scoring
        include,
      })
    : await prisma.product.findMany({
        where: baseWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: pageSize * 3,
        include,
      });

  const similarProducts = qTrim
    ? candidateProducts
        .map((p) => ({ p, s: scoreProduct(p, tokens) }))
        .filter((x) => x.s >= minMatch)
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
