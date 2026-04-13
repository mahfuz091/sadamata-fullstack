"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPrivateUrl, uploadToS3 } from "@/lib/s3";
import { revalidatePath } from "next/cache";

const MAX_VIDEO_BYTES = 2 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/ogg"]);

function getFileExtension(fileName = "") {
  const ext = fileName.split(".").pop();
  return ext && ext !== fileName ? ext.toLowerCase() : "bin";
}

async function uploadReviewMedia({ file, userId, productId }) {
  if (!file || file.size === 0) return { mediaKey: null, mediaType: null };

  const contentType = file.type || "application/octet-stream";
  const isImage = IMAGE_TYPES.has(contentType);
  const isVideo = VIDEO_TYPES.has(contentType);

  if (!isImage && !isVideo) {
    return {
      error: "Please upload an image or video file.",
    };
  }

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return {
      error: "Video file must be 2MB or smaller.",
    };
  }

  const ext = getFileExtension(file.name);
  const key = `reviews/${productId}/${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadToS3({
    key,
    body: buffer,
    contentType,
  });

  return {
    mediaKey: key,
    mediaType: isImage ? "IMAGE" : "VIDEO",
  };
}

export async function submitProductReview(payload = {}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: "Please login to review this product." };
  }

  const productId = String(payload.productId || "");
  const orderItemId = String(payload.orderItemId || "");
  const rating = Number(payload.rating || 0);
  const comment = String(payload.comment || "").trim();
  const mediaFile = payload.mediaFile || null;

  if (!productId || !orderItemId) {
    return { ok: false, error: "Review product or order item is missing." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please select a rating from 1 to 5." };
  }

  if (!comment) {
    return { ok: false, error: "Please write your review." };
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
      productId,
      order: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    },
    select: {
      id: true,
      productId: true,
    },
  });

  if (!orderItem) {
    return {
      ok: false,
      error: "Only completed purchased items can be reviewed.",
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, productId: true },
  });

  if (!product) {
    return { ok: false, error: "Product not found." };
  }

  const media = await uploadReviewMedia({
    file: mediaFile,
    userId: session.user.id,
    productId,
  });

  if (media.error) {
    return { ok: false, error: media.error };
  }

  const mediaData = media.mediaKey
    ? {
        mediaKey: media.mediaKey,
        mediaType: media.mediaType,
      }
    : {};

  const review = await prisma.productReview.upsert({
    where: { orderItemId },
    update: {
      rating,
      comment,
      ...mediaData,
    },
    create: {
      productId,
      userId: session.user.id,
      orderItemId,
      rating,
      comment,
      ...mediaData,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      mediaKey: true,
      mediaType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  revalidatePath(`/products/${product.productId}`);
  revalidatePath("/orders");

  return {
    ok: true,
    review: {
      ...review,
      mediaUrl: review.mediaKey ? await getPrivateUrl(review.mediaKey, 3600) : null,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    },
  };
}
