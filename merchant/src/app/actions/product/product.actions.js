"use server";

import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Helper to save uploaded file from FormData
async function saveFile(file, fieldName) {
  if (!file) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${fieldName}${ext}`;
  const filepath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

// CREATE PRODUCT
export async function createProduct(formData) {
  try {
    const title = formData.get("title");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const brandId = formData.get("brandId") || null;
    const brandCommissionPct = formData.get("brandCommissionPct")
      ? parseFloat(formData.get("brandCommissionPct"))
      : null;
    const merchantCommissionPct = formData.get("merchantCommissionPct")
      ? parseFloat(formData.get("merchantCommissionPct"))
      : null;
    const mockupId = formData.get("mockupId");
    const userId = formData.get("userId");
    const visibility = formData.get("visibility") || "SEARCHABLE";

    // Handle Variants and Images
    const variants = [];
    let index = 0;

    while (formData.get(`variants[${index}][color]`)) {
      const color = formData.get(`variants[${index}][color]`);
      const fitType = formData.get(`variants[${index}][fitType]`);
      const variantPrice = formData.get(`variants[${index}][price]`)
        ? parseFloat(formData.get(`variants[${index}][price]`))
        : null;

      // Handle multiple images per variant
      const images = [];
      let imgIndex = 0;
      while (formData.get(`variants[${index}][images][${imgIndex}][type]`)) {
        const type = formData.get(`variants[${index}][images][${imgIndex}][type]`);
        const file = formData.get(`variants[${index}][images][${imgIndex}][file]`);

        const url = file && file.size > 0 
          ? await saveFile(file, `variant${index}-img${imgIndex}`) 
          : null;

        if (url) {
          images.push({ type, url });
        }
        imgIndex++;
      }

      variants.push({
        color,
        fitType,
        price: variantPrice,
        images: {
          create: images,
        },
      });

      index++;
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        brandId,
        brandCommissionPct,
        merchantCommissionPct,
        mockupId,
        userId,
        visibility,
        variants: {
          create: variants,
        },
      },
      include: {
        variants: { include: { images: true } },
        Brand: true,
        features: true,
        tags: true,
        Mockup: true,
        User: true,
        sales: true,
      },
    });

    return {
      success: true,
      product,
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error in product creation:", error);
    return {
      success: false,
      message: error.message || "Something went wrong, please try again.",
    };
  }
}


// UPDATE PRODUCT
export async function updateProduct(formData) {
  const id = formData.get("id");

  const updateData = {};
  if (formData.get("title")) updateData.title = formData.get("title");
  if (formData.get("description")) updateData.description = formData.get("description");
  if (formData.get("price")) updateData.price = parseFloat(formData.get("price"));
  if (formData.get("brandId")) updateData.brandId = formData.get("brandId");
  if (formData.get("brandName")) updateData.brandId = formData.get("brandName");
  if (formData.get("brandCommissionPct"))
    updateData.brandCommissionPct = parseFloat(formData.get("brandCommissionPct"));
  if (formData.get("merchantCommissionPct"))
    updateData.merchantCommissionPct = parseFloat(formData.get("merchantCommissionPct"));
  if (formData.get("mockupId")) updateData.mockupId = formData.get("mockupId");
  if (formData.get("visibility")) updateData.visibility = formData.get("visibility");

  // Update existing product
  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  // Update Variants and Images
  let index = 0;
  while (formData.get(`variants[${index}][id]`)) {
    const variantId = formData.get(`variants[${index}][id]`);
    const variantData = {};
    if (formData.get(`variants[${index}][color]`))
      variantData.color = formData.get(`variants[${index}][color]`);
    if (formData.get(`variants[${index}][fitType]`))
      variantData.fitType = formData.get(`variants[${index}][fitType]`);
    if (formData.get(`variants[${index}][price]`))
      variantData.price = parseFloat(formData.get(`variants[${index}][price]`));

    // Update variant
    await prisma.productVariant.update({
      where: { id: variantId },
      data: variantData,
    });

    // Handle variant images
    let imgIndex = 0;
    while (formData.get(`variants[${index}][images][${imgIndex}][type]`)) {
      const type = formData.get(`variants[${index}][images][${imgIndex}][type]`);
      const file = formData.get(`variants[${index}][images][${imgIndex}][file]`);

      if (file && file.size > 0) {
        const url = await saveFile(file, `variant${index}-img${imgIndex}`);
        await prisma.productImage.create({
          data: {
            variantId,
            type,
            url,
          },
        });
      }
      imgIndex++;
    }

    index++;
  }

  return await getProductById(id);
}

// DELETE PRODUCT
export async function deleteProduct(id) {
  await prisma.product.delete({ where: { id } });
  return { success: true };
}

// GET ALL PRODUCTS
export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      variants: {
        include: { images: true },
      },
      Brand: true,
      features: true,
      tags: true,
      Mockup: true,
      User: true,
      sales: true,
    },
  });
}

// GET PRODUCT BY ID
export async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        include: { images: true },
      },
      Brand: true,
      features: true,
      tags: true,
      Mockup: true,
      User: true,
      sales: true,
    },
  });
}

// GET PRODUCTS BY USER ID
export async function getProductsByUserId(userId) {
  return await prisma.product.findMany({
    where: { userId },
    include: {
      variants: {
        include: { images: true },
      },
      Brand: true,
      features: true,
      tags: true,
      Mockup: true,
      User: true,
      sales: true,
    },
  });
}

// GET PRODUCTS BY BRAND ID
export async function getProductsByBrandId(brandId) {
  return await prisma.product.findMany({
    where: { brandId },
    include: {
      variants: {
        include: { images: true },
      },
      Brand: true,
      features: true,
      tags: true,
      Mockup: true,
      User: true,
      sales: true,
    },
  });
}

// GET PRODUCTS BY MOCKUP ID
export async function getProductsByMockupId(mockupId) {
  return await prisma.product.findMany({
    where: { mockupId },
    include: {
      variants: {
        include: { images: true },
      },
      Brand: true,
      features: true,
      tags: true,
      Mockup: true,
      User: true,
      sales: true,
    },
  });
}
