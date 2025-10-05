"use server";

import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";
import generateBlogId from "@/utils/generateTitle";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const uploadProductDir = path.join(process.cwd(), "public", "uploads", "product");

// Helper to save uploaded file from FormData

async function resolveEffectiveCommissions({ merchantId, brandId }) {
  // 1️⃣ Merchant + Brand specific rule
  const pairRule = await prisma.commissionSetting.findFirst({
    where: { isActive: true, merchantId, brandId: brandId || undefined },
    orderBy: { effectiveFrom: "desc" },
  });
  if (pairRule) {
    return {
      brandPct: pairRule.brandCommissionPct,
      merchantPct: pairRule.merchantCommissionPct,
      source: "merchant+brand rule",
    };
  }

  // 2️⃣ Merchant-only rule
  const merchantRule = await prisma.commissionSetting.findFirst({
    where: { isActive: true, merchantId, brandId: null },
    orderBy: { effectiveFrom: "desc" },
  });
  if (merchantRule) {
    return {
      brandPct: merchantRule.brandCommissionPct,
      merchantPct: merchantRule.merchantCommissionPct,
      source: "merchant-only rule",
    };
  }

  // 3️⃣ Brand-only rule
  if (brandId) {
    const brandRule = await prisma.commissionSetting.findFirst({
      where: { isActive: true, merchantId: null, brandId },
      orderBy: { effectiveFrom: "desc" },
    });
    if (brandRule) {
      return {
        brandPct: brandRule.brandCommissionPct,
        merchantPct: brandRule.merchantCommissionPct,
        source: "brand-only rule",
      };
    }
  }

  // 4️⃣ Brand default percentages
  if (brandId) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { defaultBrandPct: true, defaultMerchantPct: true },
    });
    if (brand) {
      return {
        brandPct: brand.defaultBrandPct || 10,
        merchantPct: brand.defaultMerchantPct || 10,
        source: "brand defaults",
      };
    }
  }

  // 5️⃣ Hard fallback
  return { brandPct: 10, merchantPct: 10, source: "hard fallback" };
}

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
// Helper to save uploaded file from FormData
async function saveProductFile(file, fieldName) {
  if (!file) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${fieldName}${ext}`;
  const filepath = path.join(uploadProductDir, filename);

  await fs.mkdir(uploadProductDir, { recursive: true });
  await fs.writeFile(filepath, buffer);
  return `/uploads/product/${filename}`;
}

// CREATE PRODUCT
// export async function createProduct(formData) {
//   try {
//     const title = formData.get("title");
//     const description = formData.get("description");
//     const price = parseFloat(formData.get("price"));
//     const brandId = formData.get("brandId") || null;
//     const brandCommissionPct = formData.get("brandCommissionPct")
//       ? parseFloat(formData.get("brandCommissionPct"))
//       : null;
//     const merchantCommissionPct = formData.get("merchantCommissionPct")
//       ? parseFloat(formData.get("merchantCommissionPct"))
//       : null;
//     const mockupId = formData.get("mockupId");
//     const userId = formData.get("userId");
//     const visibility = formData.get("visibility") || "SEARCHABLE";

//     // Handle Variants and Images
//     const variants = [];
//     let index = 0;

//     while (formData.get(`variants[${index}][color]`)) {
//       const color = formData.get(`variants[${index}][color]`);
//       const fitType = formData.get(`variants[${index}][fitType]`);
//       const variantPrice = formData.get(`variants[${index}][price]`)
//         ? parseFloat(formData.get(`variants[${index}][price]`))
//         : null;

//       // Handle multiple images per variant
//       const images = [];
//       let imgIndex = 0;
//       while (formData.get(`variants[${index}][images][${imgIndex}][type]`)) {
//         const type = formData.get(`variants[${index}][images][${imgIndex}][type]`);
//         const file = formData.get(`variants[${index}][images][${imgIndex}][file]`);

//         const url = file && file.size > 0
//           ? await saveFile(file, `variant${index}-img${imgIndex}`)
//           : null;

//         if (url) {
//           images.push({ type, url });
//         }
//         imgIndex++;
//       }

//       variants.push({
//         color,
//         fitType,
//         price: variantPrice,
//         images: {
//           create: images,
//         },
//       });

//       index++;
//     }

//     const product = await prisma.product.create({
//       data: {
//         title,
//         description,
//         price,
//         brandId,
//         brandCommissionPct,
//         merchantCommissionPct,
//         mockupId,
//         userId,
//         visibility,
//         variants: {
//           create: variants,
//         },
//       },
//       include: {
//         variants: { include: { images: true } },
//         Brand: true,
//         features: true,
//         tags: true,
//         Mockup: true,
//         User: true,
//         sales: true,
//       },
//     });

//     return {
//       success: true,
//       product,
//       message: "Product created successfully",
//     };
//   } catch (error) {
//     console.error("Error in product creation:", error);
//     return {
//       success: false,
//       message: error.message || "Something went wrong, please try again.",
//     };
//   }
// }

// export async function createProduct(formData) {
//   try {
//     const title = formData.get("title");
//     const description = formData.get("description");
//     const price = parseFloat(formData.get("price"));
//     const brandId = formData.get("brandId") || null;
//     const brandName = formData.get("brandName") || null;
    

//     const mockupId = formData.get("mockupId") || null; // REQUIRED if relation is required
//     const userId = formData.get("userId") || null; // REQUIRED if relation is required
//     const visibility = (formData.get("visibility") ?? "true") === "true";

//     const frontDesignFile = formData.get("frontDesign");
//     const backDesignFile  = formData.get("backDesign");
// console.log(brandId, "brandId");

//  // 🔹 Derive commission percentages (instead of trusting client)
//     const { brandPct, merchantPct } = await resolveEffectiveCommissions( {
//       merchantId: userId,
//       brandId,
//     });

//     const isNonEmptyFile = (f) => f && typeof f.size === "number" && f.size > 0;

//     // 2) Save files -> get URLs
//     const frontDesignUrl = isNonEmptyFile(frontDesignFile)
//       ? await saveProductFile(frontDesignFile, "frontDesign") // returns URL string
//       : null;

//     const backDesignUrl = isNonEmptyFile(backDesignFile)
//       ? await saveProductFile(backDesignFile, "backDesign")
//       : null;

//     // If your Prisma schema requires frontDesign to be non-null:
//     if (!frontDesignUrl) {
//       throw new Error("frontDesign is required (no file uploaded or zero size).");
//     }
//     // ---- arrays from indexed fields
//     const tags = [];
//     const features = [];

//     for (const key of formData.keys()) {
//       let m = key.match(/^tags\[(\d+)\]$/);
//       if (m) {
//         const idx = Number(m[1]);
//         tags[idx] = (formData.get(key) || "").toString();
//       }
//       m = key.match(/^features\[(\d+)\]$/);
//       if (m) {
//         const idx = Number(m[1]);
//         features[idx] = (formData.get(key) || "").toString();
//       }
//     }
//     // if your schema requires these relations, fail early
//     if (!mockupId) throw new Error("mockupId is required.");
//     if (!userId) throw new Error("userId is required.");

//     // Build variants + nested images
//     const variants = [];
//     let index = 0;

//     while (formData.get(`variants[${index}][color]`)) {
//       const color = formData.get(`variants[${index}][color]`);
//       const fitType = formData.get(`variants[${index}][fitType]`);
//       const frontImg = formData.get(`variants[${index}][frontImg]`);
//       const backImg = formData.get(`variants[${index}][backImg]`);

//       const frontImgUrl =
//         frontImg && frontImg.size > 0
//           ? await saveProductFile(frontImg, "frontImg")
//           : null;
//       const backImgUrl =
//         backImg && backImg.size > 0 ? await saveProductFile(backImg, "backImg") : null;

//       variants.push({
//         color,
//         fitType,
//         frontImg: frontImgUrl,
//         backImg: backImgUrl,
//       });

//       index++;
//     }

//     const productId = generateBlogId(title)

    
//     // Build data object with relation connects
//     const data = {
//       title,
//       productId,
//       description,
//       price,
//       // ✅ Auto-applied commissions
//       brandCommissionPct: brandPct,
//       merchantCommissionPct: merchantPct,
//       visibility,
//       brandName,
//       frontDesign : frontDesignUrl,
//       backDesign : backDesignUrl,
//       tags: { create: tags.filter(Boolean).map((value) => ({ value })) },
//       features: {
//         create: features.filter(Boolean).map((content) => ({ content })),
//       },
//       // Required relations: connect by id
//       User: { connect: { id: userId } },
//       Mockup: { connect: { id: mockupId } },

//       // Optional brand: connect only if provided
//       ...(brandId ? { Brand: { connect: { id: brandId } } } : {}),

//       variants: { create: variants },
//     };

//     const product = await prisma.product.create({
//       data,
//       include: {
//         variants: true,
//         Brand: true,
//         features: true,
//         tags: true,
//         Mockup: true,
//         User: true,
//         sales: true,
//       },
//     });

//     return {
//       success: true,
//       // product,
//       message: "Product created successfully",
//     };
//   } catch (error) {
//     console.error("Error in product creation:", error);
//     return {
//       success: false,
//       message: error?.message || "Something went wrong, please try again.",
//     };
//   }
// }
export async function createProduct(formData) {
  try {
    const title = (formData.get("title") || "").toString();
    const description = (formData.get("description") || "").toString();
    const price = parseFloat(formData.get("price"));
    const brandId = formData.get("brandId") || null;
    const brandName = formData.get("brandName") || null;

    const mockupId = formData.get("mockupId") || null;
    const userId = formData.get("userId") || null;

    const visibility = ((formData.get("visibility") ?? "true").toString() === "true");

    const frontDesignFile = formData.get("frontDesign");
    const backDesignFile  = formData.get("backDesign");

    if (!mockupId) throw new Error("mockupId is required.");
    if (!userId) throw new Error("userId is required.");
    if (!title) throw new Error("title is required.");
    if (!Number.isFinite(price)) throw new Error("price is required and must be a number.");

    // Derive commissions on server
    const { brandPct, merchantPct } = await resolveEffectiveCommissions({
      merchantId: userId,
      brandId,
    });

    // Save files BEFORE the transaction (I/O)
    const isNonEmptyFile = (f) => f && typeof f.size === "number" && f.size > 0;

    const frontDesignUrl = isNonEmptyFile(frontDesignFile)
      ? await saveProductFile(frontDesignFile, "frontDesign")
      : null;

    const backDesignUrl = isNonEmptyFile(backDesignFile)
      ? await saveProductFile(backDesignFile, "backDesign")
      : null;

    if (!frontDesignUrl) {
      throw new Error("frontDesign is required (no file uploaded or zero size).");
    }

    // Arrays
    const tags = [];
    const features = [];
    for (const key of formData.keys()) {
      let m = key.match(/^tags\[(\d+)\]$/);
      if (m) {
        const idx = Number(m[1]);
        tags[idx] = (formData.get(key) || "").toString();
      }
      m = key.match(/^features\[(\d+)\]$/);
      if (m) {
        const idx = Number(m[1]);
        features[idx] = (formData.get(key) || "").toString();
      }
    }

    // Variants + images
    const variantsInput = [];
    let v = 0;
    while (formData.get(`variants[${v}][color]`)) {
      const color = formData.get(`variants[${v}][color]`) || null;
      const fitType = formData.get(`variants[${v}][fitType]`) || null;
      const frontImgFile = formData.get(`variants[${v}][frontImg]`);
      const backImgFile = formData.get(`variants[${v}][backImg]`);

      const frontImgUrl =
        frontImgFile && frontImgFile.size > 0
          ? await saveProductFile(frontImgFile, "frontImg")
          : null;

      const backImgUrl =
        backImgFile && backImgFile.size > 0
          ? await saveProductFile(backImgFile, "backImg")
          : null;

      variantsInput.push({
        color,
        fitType,
        frontImg: frontImgUrl,
        backImg: backImgUrl,
      });

      v++;
    }

    const productId = generateBlogId(title);

    // ============ ATOMIC: product create + tiar decrement + leftTiar update ============
    await prisma.$transaction(async (tx) => {
      // 1) Total products BEFORE creation
      const totalBefore = await tx.product.count({ where: { userId } });

      // Decrement amount = current total products (before new one)
      const DECREMENT = totalBefore; // change to totalBefore + 1 to base on "after creation" instead

      // 2) Fetch merchant profile
      const merchantProfile = await tx.merchantProfile.findUnique({
        where: { userId },
        select: { tiar: true },
      });
      if (!merchantProfile) throw new Error("Merchant profile not found for this user.");

      // 3) Balance check (only if we actually decrement)
      if (DECREMENT > 0 && merchantProfile.tiar < DECREMENT) {
        throw new Error("Insufficient tiar balance for this operation.");
      }

      // 4) Create product
      await tx.product.create({
        data: {
          title,
          productId,
          description,
          price,
          brandCommissionPct: brandPct,
          merchantCommissionPct: merchantPct,
          visibility,
          brandName,
          frontDesign: frontDesignUrl,
          backDesign: backDesignUrl,

          User: { connect: { id: userId } },
          Mockup: { connect: { id: mockupId } },
          ...(brandId ? { Brand: { connect: { id: brandId } } } : {}),

          tags: { create: tags.filter(Boolean).map((value) => ({ value })) },
          features: { create: features.filter(Boolean).map((content) => ({ content })) },
          variants: { create: variantsInput },
        },
      });

      // 5) Compute totals/leftTiar after creation
    
     

      // total AFTER creation
  const totalAfter = totalBefore + 1;

  // leftTiar = tiar - totalAfter (never negative)
  const leftTiar = Math.max(0, merchantProfile.tiar - totalAfter);

  // update ONLY leftTiar (do NOT touch tiar)
  await tx.merchantProfile.update({
    where: { userId },
    data: { leftTiar: { set: leftTiar } },
  });
    });
    // ================================================================================

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error in product creation:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong, please try again.",
    };
  }
}



// UPDATE PRODUCT
export async function updateProduct(formData) {
  const id = formData.get("id");

  const updateData = {};
  if (formData.get("title")) updateData.title = formData.get("title");
  if (formData.get("description"))
    updateData.description = formData.get("description");
  if (formData.get("price"))
    updateData.price = parseFloat(formData.get("price"));
  if (formData.get("brandId")) updateData.brandId = formData.get("brandId");
  if (formData.get("brandName")) updateData.brandId = formData.get("brandName");
  if (formData.get("brandCommissionPct"))
    updateData.brandCommissionPct = parseFloat(
      formData.get("brandCommissionPct")
    );
  if (formData.get("merchantCommissionPct"))
    updateData.merchantCommissionPct = parseFloat(
      formData.get("merchantCommissionPct")
    );
  if (formData.get("mockupId")) updateData.mockupId = formData.get("mockupId");
  if (formData.get("visibility"))
    updateData.visibility = formData.get("visibility");

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
      const type = formData.get(
        `variants[${index}][images][${imgIndex}][type]`
      );
      const file = formData.get(
        `variants[${index}][images][${imgIndex}][file]`
      );

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
