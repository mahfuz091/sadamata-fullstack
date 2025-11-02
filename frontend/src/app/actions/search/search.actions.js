// =============================
// app/search/actions.js (no Zod)
// =============================
'use server'

import prisma from "@/lib/prisma"

/**
 * Accepts: { q, slug, brandId, minPrice, maxPrice, color, fitType, tag, page, pageSize, sort }
 * - slug maps to Mockup.name (case-insensitive match)
 */
export async function searchProducts(input) {
  const params = input instanceof FormData ? Object.fromEntries(input.entries()) : (input || {})

  // --- parse numbers sanely ---
  const n = (x) => {
    const v = Number(x)
    return Number.isFinite(v) ? v : null
  }

  const page = n(params.page) && n(params.page) > 0 ? n(params.page) : 1
  const pageSize = n(params.pageSize) && n(params.pageSize) > 0 ? Math.min(n(params.pageSize), 100) : 12
  const skip = (page - 1) * pageSize
  const take = pageSize

  const q = params.q?.toString().trim() || null
  const slug = params.slug?.toString().trim() || null // Mockup.name
  const brandId = params.brandId?.toString() || null
  const minPrice = n(params.minPrice)
  const maxPrice = n(params.maxPrice)
  const color = params.color?.toString().trim() || null
  const fitType = params.fitType?.toString() || null
  const tag = params.tag?.toString().trim() || null
  const sort = params.sort?.toString() || 'relevance'

  // --- where builder ---
  const where = {
    isActive: true,
    visibility: true,
    AND: [
      q
        ? {
            OR: [
              { title:       { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { tags:   { some: { value: { contains: q, mode: 'insensitive' } } } },
              { Brand:  { is: { name:  { contains: q, mode: 'insensitive' } } } },
              { Mockup: { is: { name:  { contains: q, mode: 'insensitive' } } } },
               { brandName:   { contains: q, mode: 'insensitive' } }, 
            ],
          }
        : null,
      // slug maps to Mockup.name (case-insensitive)
      slug ? { Mockup: { is: { name: { contains: slug, mode: 'insensitive' } } } } : null,
      brandId ? { brandId } : null,
      minPrice != null ? { price: { gte: minPrice } } : null,
      maxPrice != null ? { price: { lte: maxPrice } } : null,
      // exact color but case-insensitive → use contains-insensitive to avoid equals-mode limitation
      color ? { variants: { some: { color: { contains: color, mode: 'insensitive' } } } } : null,
      fitType ? { variants: { some: { fitType } } } : null,
      // exact tag but case-insensitive → same trick with contains-insensitive
      tag ? { tags: { some: { value: { contains: tag, mode: 'insensitive' } } } } : null,
    ].filter(Boolean),
  }

  // --- sort ---
  let orderBy
  switch (sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    default:
      // pseudo “relevance”: newest-first fallback
      orderBy = [{ createdAt: 'desc' }]
  }

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        Brand:   { select: { id: true, name: true } },
        Mockup:  { select: { id: true, name: true } },
        variants:{ select: { color: true, fitType: true, frontImg: true, backImg: true } },
        tags:    { select: { value: true } },
      },
    }),
  ])

  const items = products.map((p) => ({
    id: p.id,
    productId: p.productId,
    title: p.title,
    description: p.description,
    price: p.price,
    brandId: p.brandId ?? null,
    brandName: p.Brand?.name ?? p.brandName ?? null,
    mockupName: p.Mockup?.name ?? null,
    isActive: p.isActive,
    visibility: p.visibility,
    variants: p.variants.map((v) => ({
      color: v.color,
      fitType: v.fitType,
      frontImg: v.frontImg,
      backImg: v.backImg,
    })),
    tags: p.tags.map((t) => t.value),
  }))

  return { items, total, page, pageSize }
}
