'use server'

import { prisma } from "@/lib/prisma"
import { requireSessionUserId } from "@/lib/session";






export const getBrandId = async (userId) => {
  await requireSessionUserId(userId);

    const brand = await prisma.brand.findFirst({
        where: {
            userId: userId,
        },
    })
    console.log(brand, "brand");
    
    const brandId = brand?.id
    return brandId
}