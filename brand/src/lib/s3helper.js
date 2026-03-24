import sharp from "sharp";
import { uploadToS3 } from "@/lib/s3";
import { productKey, designKey, profileKey, bannerBrandKey } from "@/lib/s3Keys";

async function fileToBuffer(file) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes);
}

// PRODUCTS → resize → PNG
export async function saveProductFileS3(file, productId, fieldName) {
  if (!file || !file.size) return null;

  const input = await fileToBuffer(file);

  const pngBuffer = await sharp(input)
    .resize(500, 600, { fit: "inside" }) // same as you had
    .png({ compressionLevel: 9 }) // PNG compression (no quality loss)
    .toBuffer();

  const key = productKey({
    productId,
    filename: `${fieldName}.png`,
  });

  return await uploadToS3({
    key,
    body: pngBuffer,
    contentType: "image/png",
  });
}

export async function saveDesignFileS3(file, designId, fieldName) {
  if (!file || !file.size) return null;

  const buffer = await fileToBuffer(file);

  const key = designKey({
    designId,
    filename: file.name, // keep original name & extension
  });

  return await uploadToS3({
    key,
    body: buffer,
    contentType: file.type || "application/octet-stream",
  });
}
export async function saveBrandBannerFileS3(file, bannerId, fieldName) {
  if (!file || !file.size) return null;

  const buffer = await fileToBuffer(file);

  const key = bannerBrandKey({
    bannerId,
    filename: file.name, // keep original name & extension
  });

  return await uploadToS3({
    key,
    body: buffer,
    contentType: file.type || "application/octet-stream",
  });
}
export async function saveProfileImageS3(file, userId) {
  if (!file || !file.size) return null;

  const input = await fileToBuffer(file);

  const pngBuffer = await sharp(input)
    .resize(600, 600, { fit: "cover" })
    .png()
    .toBuffer();

  const key = profileKey({
    userId,
    filename: "profile.png",
  });

  return await uploadToS3({
    key,
    body: pngBuffer,
    contentType: "image/png",
  });
}
