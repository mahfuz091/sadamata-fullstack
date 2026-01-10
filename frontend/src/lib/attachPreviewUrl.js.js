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

export async function attachPreviewUrlTwo(items = []) {
  if (!items?.length) return [];

  return Promise.all(
    items.map(async (p) => {
      const variants = await Promise.all(
        (p.variants || []).map(async (v) => {
          const frontImgUrl = v.frontImg
            ? await getPrivateUrl(v.frontImg, SIGN_EXPIRES)
            : null;

          const backImgUrl = v.backImg
            ? await getPrivateUrl(v.backImg, SIGN_EXPIRES)
            : null;

          return { ...v, frontImgUrl, backImgUrl };
        })
      );

      // product-level preview (optional)
      const firstKey =
        variants?.find((x) => x.frontImgUrl)?.frontImg ||
        variants?.find((x) => x.backImgUrl)?.backImg ||
        p.frontDesign ||
        p.backDesign ||
        null;

      const previewUrl = firstKey
        ? await getPrivateUrl(firstKey, SIGN_EXPIRES)
        : null;

      return { ...p, variants, previewUrl };
    })
  );
}
