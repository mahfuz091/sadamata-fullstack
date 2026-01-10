import { getPrivateUrl } from "@/lib/s3";

const SIGN_EXPIRES = 60 * 60; // 1 hour

export async function attachPreviewUrl(products) {
  return Promise.all(
    products.map(async (p) => {
      const activeVariant =
        p.variants?.find((v) => v.isActive && (v.frontImg || v.backImg)) ||
        null;

      const key =
        activeVariant?.frontImg ||
        activeVariant?.backImg ||
        p.variants?.[0]?.frontImg ||
        p.variants?.[0]?.backImg ||
        p.frontDesign ||
        null;

      const previewUrl = key ? await getPrivateUrl(key, SIGN_EXPIRES) : null;

      return { ...p, previewUrl };
    })
  );
}
