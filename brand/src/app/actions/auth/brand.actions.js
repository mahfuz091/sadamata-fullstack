import { prisma } from "@/lib/prisma";
import { generateBrandSlug } from "@/lib/brandSlug";

export const createBrand = async (
  userId,
  brandCategoryId,
  brandName,
  password
) => {
  const brandSlug = await generateBrandSlug(prisma, brandName);
  const newBrand = await prisma.brand.create({
    data: {
      name: brandName,
      brandSlug,
      password: password,
      isActive: false, // Default to false, can be updated later by admin
      userId: userId, // Assuming userId is the ID of the user creating the brand
      brandCategory: {
        connect: { id: brandCategoryId }, // Connecting to an existing BrandCategory
      },
    },
  });
  return newBrand;
};
