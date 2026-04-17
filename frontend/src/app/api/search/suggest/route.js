import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path
import { attachPreviewUrl } from "@/lib/attachPreviewUrl.js";

const TAKE_PRODUCTS = 7;
const TAKE_CATEGORIES = 6;
const TAKE_BRANDS = 6;
const TAKE_QUERIES = 6;

const norm = (s) => (s || "").trim().replace(/\s+/g, " ");

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
    { categories: { some: { name: { contains: term, mode: "insensitive" } } } },
    { brandName: { contains: term, mode: "insensitive" } },
  ]);
};

const BASE = process.env.NEXT_PUBLIC_MERCH_URL?.replace(/\/$/, "") || "";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = norm(searchParams.get("q") || "");
  const slug = norm(searchParams.get("slug") || ""); // your selected dropdown (Mockup name)
  if (!q) {
    return NextResponse.json({
      queries: [],
      categories: [],
      brands: [],
      products: [],
    });
  }

  const qOr = buildQOr(q);

  const activeVariantWhere = { OR: [{ isActive: true }, { isActive: null }] };

  const baseWhere = {
    isActive: true,
    visibility: true,
    AND: [
      { variants: { some: activeVariantWhere } },
      qOr ? { OR: qOr } : null,
      slug
        ? { Mockup: { is: { name: { contains: slug, mode: "insensitive" } } } }
        : null,
    ].filter(Boolean),
  };

  // ✅ Products suggestions (show thumb + title)
  const products = await prisma.product.findMany({
    where: baseWhere,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: TAKE_PRODUCTS,
    select: {
      id: true,
      productId: true,
      title: true,
      price: true,
      brandName: true,
      Brand: { select: { name: true } },
      variants: {
        where: activeVariantWhere,
        select: { frontImg: true },
        take: 1,
      },
    },
  });

  // Attach S3 URLs to the products
  const productsWithUrls = await attachPreviewUrl(products);

  // ✅ Categories suggestions (based on ProductCategory name)
  const categories = await prisma.productCategory.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: TAKE_CATEGORIES,
    select: { id: true, name: true },
  });

  // ✅ Brands suggestions (Brand.name)
  const brands = await prisma.brand.findMany({
    where: { isActive: true, name: { contains: q, mode: "insensitive" } },
    orderBy: { name: "asc" },
    take: TAKE_BRANDS,
    select: { id: true, name: true },
  });

  const queries = [
    q,
  ...productsWithUrls.slice(0, 4).map((p) => p.title),
    ...categories.slice(0, 2).map((c) => c.name),
  ]
    .map(norm)
    .filter(Boolean)
    .filter((x, i, arr) => arr.indexOf(x) === i)
    .slice(0, TAKE_QUERIES);

  return NextResponse.json({
    queries,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.name,
    })),
    brands: brands.map((b) => ({ id: b.id, name: b.name, slug: b.name })),
    products: productsWithUrls.map((p) => {
      const rawThumb = p.variants?.[0]?.frontImg ?? null;
      const thumb = p.previewUrl;

      return {
        id: p.id,
        title: p.title,
        slug: p.productId,
        price: p.price,
        brandName: p.Brand?.name ?? p.brandName ?? null,
        thumb,
      };
    }),
  });
}
