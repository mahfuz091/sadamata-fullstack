"use server";

import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";
import generateBlogId from "@/utils/generateTitle";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const uploadProductDir = path.join(process.cwd(), "uploads", "products");
const uploadDesignDir = path.join(process.cwd(), "uploads", "designs");

// Helper to save uploaded file from FormData

// --- Title helpers ---

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "to",
  "of",
  "with",
  "in",
  "on",
  "at",
  "from",
  "by",
  "as",
  "is",
  "are",
]);

const AMAZON_LOWERCASE_WORDS = new Set([...STOP_WORDS, "vs", "via", "per"]);

function isBanglaText(s = "") {
  // Bangla unicode block: \u0980-\u09FF
  return /[\u0980-\u09FF]/.test(s);
}

// "Standard T-Shirt" -> "T-Shirt"
// optional: strip known prefixes like Men/Women/Standard/Premium etc.
function getProductTypeFromMockup(mockupName = "") {
  let name = String(mockupName).trim();

  // remove common leading descriptors if you want
  name = name.replace(/^(men|women|kids|standard|premium|classic)\s+/i, "");

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return name;

  // if you didn't strip prefixes above, this will drop the first token only:
  // return parts.slice(1).join(" ");

  return parts.join(" "); // since we stripped prefixes, keep remaining
}

// Amazon-like title casing (English only-ish)
function amazonTitleCase(input = "") {
  const s = String(input).trim().replace(/\s+/g, " ");
  if (!s) return "";

  const words = s.split(" ");

  return words
    .map((w, i) => {
      // keep tokens like "T-Shirt", "XL", "iPhone", "2025", "BDT" as-is-ish
      const hasNonLetters = /[^a-zA-Z]/.test(w);
      const isAllCaps = /^[A-Z0-9-]+$/.test(w);

      // If Bangla detected in the word, keep it as-is
      if (isBanglaText(w)) return w;

      if (isAllCaps) return w; // e.g. "XL", "BDT"
      if (hasNonLetters) {
        // Title-case subparts split by hyphen
        return w
          .split("-")
          .map((p) => {
            if (!p) return p;
            const lower = p.toLowerCase();
            const shouldLower = i !== 0 && AMAZON_LOWERCASE_WORDS.has(lower);
            if (shouldLower) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
          })
          .join("-");
      }

      const lower = w.toLowerCase();
      const shouldLower = i !== 0 && AMAZON_LOWERCASE_WORDS.has(lower);
      if (shouldLower) return lower;

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

// --- Slug helpers ---

function slugify(input = "") {
  const s = String(input)
    .trim()
    .toLowerCase()
    // Replace & with 'and' for nicer slugs
    .replace(/&/g, " and ")
    // Remove apostrophes
    .replace(/['’]/g, "")
    // Replace non-alphanumeric with dashes (keep unicode? We’ll drop for safety)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return s || "product";
}

// Ensures uniqueness by checking DB and suffixing -2, -3...
async function ensureUniqueProductId(tx, baseSlug) {
  let slug = baseSlug;
  let n = 2;

  while (true) {
    const exists = await tx.product.findFirst({
      where: { productId: slug },
      select: { id: true },
    });

    if (!exists) return slug;
    slug = `${baseSlug}-${n++}`;
  }
}

// --- Bangla + English auto-merge ---
// If you have two fields, merge like: "Cute Girl T-Shirt | কিউট গার্ল টি-শার্ট"
function mergeBnEnTitle({ enTitle, bnTitle }) {
  const en = String(enTitle || "").trim();
  const bn = String(bnTitle || "").trim();

  if (en && bn) return `${en} | ${bn}`;
  return en || bn || "";
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

async function resolveEffectiveCommissions({ merchantId, brandId }) {
  // 1️⃣ Merchant + Brand specific rule
  const pairRule = await prisma.commissionSetting.findFirst({
    where: { isActive: true, merchantId, brandId: brandId || undefined },
    orderBy: { effectiveFrom: "desc" },
  });
  console.log(merchantId, brandId, pairRule);

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
  return `/uploads/products/${filename}`;
}
async function saveDesignFile(file, fieldName) {
  if (!file) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${fieldName}${ext}`;
  const filepath = path.join(uploadDesignDir, filename);

  await fs.mkdir(uploadDesignDir, { recursive: true });
  await fs.writeFile(filepath, buffer);
  return `/uploads/designs/${filename}`;
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

    const visibility =
      (formData.get("visibility") ?? "true").toString() === "true";

    const frontDesignFile = formData.get("frontDesign");
    const backDesignFile = formData.get("backDesign");

    if (!mockupId) throw new Error("mockupId is required.");
    if (!userId) throw new Error("userId is required.");
    if (!title) throw new Error("title is required.");
    if (!Number.isFinite(price))
      throw new Error("price is required and must be a number.");
    if (price < 990) throw new Error("Minimum price is 990.");
    // Derive commissions on server
    const { brandPct, merchantPct, source } = await resolveEffectiveCommissions(
      {
        merchantId: userId,
        brandId,
      }
    );

    console.log(brandPct, merchantPct, source);

    // Save files BEFORE the transaction (I/O)
    const isNonEmptyFile = (f) => f && typeof f.size === "number" && f.size > 0;

    const frontDesignUrl = isNonEmptyFile(frontDesignFile)
      ? await saveDesignFile(frontDesignFile, "frontDesign")
      : null;

    const backDesignUrl = isNonEmptyFile(backDesignFile)
      ? await saveDesignFile(backDesignFile, "backDesign")
      : null;

    if (!frontDesignUrl && !backDesignUrl) {
      throw new Error("At least one design (front or back) must be uploaded.");
    }

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

    if (!variantsInput.length) {
      throw new Error("No valid product variants were generated.");
    }

    // Ensure variants contain at least one valid image
    const hasAnyImage = variantsInput.some((v) => v.frontImg || v.backImg);

    if (!hasAnyImage) {
      throw new Error(
        "Variants must include at least one front or back image."
      );
    }

    const normalizedVariants = variantsInput.map((v) => ({
      color: v.color,
      fitType: v.fitType,
      frontImg: v.frontImg || null,
      backImg: v.backImg || null,
    }));

    const productId = generateBlogId(title);

    const mockup = await prisma.mockup.findUnique({
      where: { id: mockupId },
      select: { name: true },
    });

    if (!mockup?.name) {
      throw new Error("Invalid mockup selected.");
    }

    // 2) Build product type from mockup name
    const productType = getProductTypeFromMockup(mockup.name); // e.g. "T-Shirt"

    // 3) Bangla + English (optional)
    // If you only have one title field today, keep it like this:
    const designTitleRaw = title.trim();

    // If in future you pass titleEn + titleBn in formData, you can do:
    // const titleEn = (formData.get("titleEn") || "").toString();
    // const titleBn = (formData.get("titleBn") || "").toString();
    // const designTitleRaw = mergeBnEnTitle({ enTitle: titleEn, bnTitle: titleBn });

    // 4) Final product title = design + type
    const finalTitleRaw = `${designTitleRaw} ${productType}`.trim();

    // 5) Amazon-style formatting (won’t change Bangla parts)
    const finalTitle = amazonTitleCase(finalTitleRaw);

    // NOTE: productId should match title logic (use finalTitleRaw or finalTitle)
    const baseSlug = slugify(finalTitleRaw);
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
      if (!merchantProfile)
        throw new Error("Merchant profile not found for this user.");

      // 3) Balance check (only if we actually decrement)
      if (DECREMENT > 0 && merchantProfile.tiar < DECREMENT) {
        throw new Error("Insufficient tiar balance for this operation.");
      }

      const totalTiar = merchantProfile.tiar;

      // 2️⃣ Hard lifetime limit
      const totalProducts = await tx.product.count({
        where: { userId },
      });

      if (totalProducts >= totalTiar) {
        throw new Error(
          `Upload limit reached. Maximum allowed products: ${totalTiar}.`
        );
      }

      // 3️⃣ Daily limit = 10% of tiar
      const dailyLimit = Math.ceil(totalTiar * 0.1);

      const { start, end } = getTodayRange();

      const todayUploads = await tx.product.count({
        where: {
          userId,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      if (todayUploads >= dailyLimit) {
        throw new Error(
          `Daily upload limit exceeded. You can upload only ${dailyLimit} product(s) per day.`
        );
      }

      const productId = await ensureUniqueProductId(tx, baseSlug);

      // 4) Create product
      await tx.product.create({
        data: {
          title: finalTitle,
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
          features: {
            create: features.filter(Boolean).map((content) => ({ content })),
          },
          variants: { create: normalizedVariants },
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
    console.log("Error in product creation:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong, please try again.",
    };
  }
}

// UPDATE PRODUCT
export async function updateProduct(formData) {
  const id = formData.get("id");
  if (!id) throw new Error("Product ID missing");

  const updateData = {};

  // -------- BASIC FIELDS --------
  if (formData.get("title")) updateData.title = formData.get("title");
  if (formData.get("description"))
    updateData.description = formData.get("description");
  if (formData.get("price")) updateData.price = Number(formData.get("price"));

  // ⚠️ FIXED BUG
  if (formData.get("brandName"))
    updateData.brandName = formData.get("brandName");

  // -------- DESIGN FILES (ONLY IF CHANGED) --------
  const frontDesignFile = formData.get("frontDesign");
  const backDesignFile = formData.get("backDesign");

  const isFile = (f) => f && typeof f.size === "number" && f.size > 0;

  if (isFile(frontDesignFile)) {
    updateData.frontDesign = await saveDesignFile(
      frontDesignFile,
      "frontDesign"
    );
  }

  if (isFile(backDesignFile)) {
    updateData.backDesign = await saveDesignFile(backDesignFile, "backDesign");
  }

  // -------- UPDATE PRODUCT ONLY ONCE --------
  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  // -------- VARIANTS (POSITION / COLOR / FIT CHANGE) --------
  // Strategy: replace variants (simple & correct)

  await prisma.productVariant.deleteMany({
    where: { productId: id },
  });

  const variants = [];
  let i = 0;

  while (formData.get(`variants[${i}][color]`)) {
    variants.push({
      productId: id,
      fitType: formData.get(`variants[${i}][fitType]`),
      color: formData.get(`variants[${i}][color]`),
    });
    i++;
  }

  if (variants.length) {
    await prisma.productVariant.createMany({ data: variants });
  }

  return { success: true };
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
      variants: true,
      Brand: true,
      features: true,
      tags: true,
      User: true,
      sales: true,
      Mockup: {
        include: {
          variants: true, // ✅ THIS WAS MISSING
        },
      },
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
