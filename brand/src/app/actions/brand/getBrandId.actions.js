'use server'

import { prisma } from "@/lib/prisma"






export const getBrandId = async (userId) => {

    const brand = await prisma.brand.findFirst({
        where: {
            userId: userId,
        },
    })
    console.log(brand, "brand");
    
    const brandId = brand?.id
    return brandId
}