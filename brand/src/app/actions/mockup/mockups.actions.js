"use server";

import { prisma } from "@/lib/prisma";



/**
 * সব Mockup নামসহ active + visible প্রোডাক্ট আনে
 * - Product: isActive = true && visibility = true
 * - প্রতিটি প্রোডাক্টের প্রথম variant ইমেজও আনা হয়
 */
export async function getMockupsWithProducts(userId) {
    if (!userId) throw new Error('userId required')

 

  // ০) ইউজারের ১ম ব্র্যান্ড খুঁজে বের করা
  const firstBrand = await prisma.brand.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true },
  })

  if (!firstBrand) {
    return {
      userId,
      brandFound: false,
      message: 'No brand found for this user',
    }
  }

  const { id: brandId, name: brandName } = firstBrand
  const rows = await prisma.mockup.findMany({
    orderBy: { name: "asc" },
    include: {
      variants: {
        select: { id: true, color: true, fitType: true, frontImg: true, backImg: true },
      },
      Product: {
        where: { isActive: true, visibility: true, brandId: brandId,  },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          brandName: true,
          Brand: { select: { id: true, name: true } },
          variants: {
            orderBy: { id: "asc" },
            take: 1,
            select: {
              id: true,
              frontImg: true,
              backImg: true,
              color: true,
              fitType: true,
            },
          },
        },
      },
    },
  });

  const mockups =  rows.map((m) => ({
    id: m.id,
    name: m.name,
    variants: m.variants,
    productCount: m.Product.length,
    products: m.Product.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      brandName: p.brandName,
      brand: p.Brand,
      variant: p.variants[0] || null,
    })),
  }));
  return { mockups, brandName };
}
