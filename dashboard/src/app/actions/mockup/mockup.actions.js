"use server";

import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

const uploadDir = path.join(process.cwd(), "public", "mockups");

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
  return `/mockups/${filename}`;
}

// Create new Mockup with Variants
export async function createMockup(formData) {
  const name = formData.get("name");

  const variants = [];
  let index = 0;

  while (formData.get(`variants[${index}][color]`)) {
    const color = formData.get(`variants[${index}][color]`);
    const fitType = formData.get(`variants[${index}][fitType]`);
    const frontImg = formData.get(`variants[${index}][frontImg]`);
    const backImg = formData.get(`variants[${index}][backImg]`);

    const frontImgUrl =
      frontImg && frontImg.size > 0
        ? await saveFile(frontImg, "frontImg")
        : null;
    const backImgUrl =
      backImg && backImg.size > 0 ? await saveFile(backImg, "backImg") : null;

    variants.push({
      color,
      fitType,
      frontImg: frontImgUrl,
      backImg: backImgUrl,
    });

    index++;
  }

  const mockup = await prisma.mockup.create({
    data: {
      name,
      variants: {
        create: variants,
      },
    },
    include: { variants: true },
  });

  return mockup;
}

/**
 * ✅ Update Mockup (currently: name only)
 * Expects FormData with:
 *  - id   (mockup id)
 *  - name (new name)
 */
export async function updateMockup(formData) {
  const id = formData.get("id");
  const name = formData.get("name");

  if (!id) {
    return { success: false, message: "Mockup id is required." };
  }

  const data = {};
  if (name && String(name).trim().length > 0) {
    data.name = String(name).trim();
  }

  if (Object.keys(data).length === 0) {
    return { success: false, message: "No fields to update." };
  }

  try {
    const mockup = await prisma.mockup.update({
      where: { id },
      data,
      include: { variants: true },
    });

    return {
      success: true,
      message: "Mockup updated successfully.",
      mockup,
    };
  } catch (err) {
    console.error("updateMockup error:", err);
    return {
      success: false,
      message: err?.message || "Failed to update mockup.",
    };
  }
}

// Update Mockup Variant
export async function updateVariant(formData) {
  const id = formData.get("id");
  const color = formData.get("color");
  const fitType = formData.get("fitType");
  const frontImg = formData.get("frontImg");
  const backImg = formData.get("backImg");

  const updateData = {};
  if (color) updateData.color = color;
  if (fitType) updateData.fitType = fitType;
  if (frontImg && frontImg.size > 0)
    updateData.frontImg = await saveFile(frontImg, "frontImg");
  if (backImg && backImg.size > 0)
    updateData.backImg = await saveFile(backImg, "backImg");

  const variant = await prisma.mockupVariant.update({
    where: { id },
    data: updateData,
  });
  return variant;
}

// Delete Mockup Variant
export async function deleteVariant(id) {
  await prisma.mockupVariant.delete({ where: { id } });
  return { success: true };
}

// Delete whole Mockup
export async function deleteMockup(id) {
  await prisma.mockup.delete({ where: { id } });
  return { success: true };
}

// Get All Mockups (with Variants)
export async function getAllMockups() {
  return await prisma.mockup.findMany({ include: { variants: true } });
}
