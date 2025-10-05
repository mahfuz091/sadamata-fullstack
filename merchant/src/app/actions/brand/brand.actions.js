import { prisma } from "@/lib/prisma";



export  const getAllBrands = async () => {
   const brand = await prisma.brand.findMany({
    where: { isActive: true },
     select: { id: true, name: true, isActive: true, updatedAt: true },
  });
   return brand;
};