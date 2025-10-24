// =============================
// app/search/actions.js (no Zod)
// =============================
'use server'

import prisma from "@/lib/prisma"


/**
 * Accepts: { q, slug, brandId, minPrice, maxPrice, color, fitType, tag, page, pageSize, sort }
 * - slug maps to Mockup.name (exact or case-insensitive)
 */
export async function searchProducts(input) {
  const params = input instanceof FormData ? Object.fromEntries(input.entries()) : (input || {})

  const page = Number(params.page) > 0 ? Number(params.page) : 1
  const pageSize = Number(params.pageSize) > 0 ? Math.min(Number(params.pageSize), 100) : 12
  const skip = (page - 1) * pageSize
  const take = pageSize

  const q = params.q?.toString().trim() || null
  const slug = params.slug?.toString().trim() || null // Mockup.name
  const brandId = params.brandId?.toString() || null
  const minPrice = params.minPrice ? Number(params.minPrice) : null
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null
  const color = params.color?.toString().trim() || null
  const fitType = params.fitType?.toString() || null
  const tag = params.tag?.toString().trim() || null
  const sort = params.sort?.toString() || 'relevance'

  const where = {
    isActive: true,
    visibility: true,
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { tags: { some: { value: { contains: q, mode: 'insensitive' } } } },
              { Brand: { name: { contains: q, mode: 'insensitive' } } },
              { Mockup: { name: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {},
      slug ? { Mockup: { name: { equals: slug, mode: 'insensitive' } } } : {},
      brandId ? { brandId } : {},
      minPrice ? { price: { gte: minPrice } } : {},
      maxPrice ? { price: { lte: maxPrice } } : {},
      color ? { variants: { some: { color: { equals: color, mode: 'insensitive' } } } } : {},
      fitType ? { variants: { some: { fitType } } } : {},
      tag ? { tags: { some: { value: { equals: tag, mode: 'insensitive' } } } } : {},
    ],
  }

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
        Brand: { select: { id: true, name: true } },
        Mockup: { select: { id: true, name: true } },
        variants: { select: { color: true, fitType: true, frontImg: true, backImg: true } },
        tags: { select: { value: true } },
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
    brandName: p.Brand?.name ?? null,
    mockupName: p.Mockup?.name ?? null,
    isActive: p.isActive,
    visibility: p.visibility,
    variants: p.variants.map((v) => ({ color: v.color, fitType: v.fitType, frontImg: v.frontImg, backImg: v.backImg })),
    tags: p.tags.map((t) => t.value),
  }))

  return { items, total, page, pageSize }
}

