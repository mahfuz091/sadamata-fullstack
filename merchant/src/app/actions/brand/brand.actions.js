import { prisma } from "@/lib/prisma";



export  const getAllBrands = async () => {
    return await prisma.brand.findMany();
};