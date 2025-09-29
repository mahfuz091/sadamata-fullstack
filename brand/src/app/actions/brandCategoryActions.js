import { prisma } from "@/lib/prisma";

// Create a new category
export const createCategory = async (categoryName) => {
  // console.log("FormData received in createCategory:", formData);
  // const categoryName = formData.get("name");
  // console.log("Creating category with name:", categoryName);
  try {
    const newCategory = await prisma.brandCategory.create({
      data: {
        name: categoryName, // The name of the category
      },
    });
    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Category creation failed");
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const categories = await prisma.brandCategory.findMany();
    return categories;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

// Get a single category by ID
export const getCategoryById = async (id) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error retrieving category:", error);
    throw new Error("Failed to fetch category");
  }
};

// Update category name by ID
export const updateCategory = async (id, newName) => {
  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
      },
    });
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return deletedCategory;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

// Assign a category to a brand
export const assignCategoryToBrand = async (brandId, categoryId) => {
  try {
    const updatedBrand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        categoryId: categoryId,
      },
    });
    return updatedBrand;
  } catch (error) {
    console.error("Error assigning category to brand:", error);
    throw new Error("Failed to assign category to brand");
  }
};

// Get all brands by category
export const getBrandsByCategory = async (categoryId) => {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true, // This will include the category details with the brand
      },
    });
    return brands;
  } catch (error) {
    console.error("Error retrieving brands by category:", error);
    throw new Error("Failed to fetch brands by category");
  }
};
