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

  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

// Create new Mockup with one Variant
export async function createMockup(formData) {
  const name = formData.get("name");
  const color = formData.get("color");
  const frontImg = formData.get("frontImg"); // this is a File object
  const backImg = formData.get("backImg"); // this is a File object

  const frontImgUrl = await saveFile(frontImg, "frontImg");
  const backImgUrl =
    backImg && backImg.size > 0 ? await saveFile(backImg, "backImg") : null;

  const mockup = await prisma.mockup.create({
    data: {
      name,
      variants: {
        create: {
          color,
          frontImg: frontImgUrl,
          backImg: backImgUrl,
        },
      },
    },
    include: { variants: true },
  });
  return mockup;
}

// Update Mockup Variant
export async function updateVariant(formData) {
  const id = formData.get("id");
  const color = formData.get("color");
  const frontImg = formData.get("frontImg");
  const backImg = formData.get("backImg");

  const updateData = {};
  if (color) updateData.color = color;
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

// Get All Mockups (with Variants)
export async function getAllMockups() {
  return await prisma.mockup.findMany({ include: { variants: true } });
}
