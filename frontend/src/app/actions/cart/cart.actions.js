"use server";

import { getPrivateUrl } from "@/lib/s3";
import { filterPublicImageKeys } from "@/lib/publicImageKeys";

// getPrivateUrl(key, expiresIn=3600)

export async function getCartImageUrls(imageKeys = []) {
  const uniq = [...new Set((imageKeys || []).filter(Boolean))];
  const allowed = await filterPublicImageKeys(uniq);

  const pairs = await Promise.all(
    uniq.map(async (key) => {
      if (!allowed.has(String(key))) return [key, null];
      try {
        const url = await getPrivateUrl(key, 3600);
        return [key, url];
      } catch (e) {
        return [key, null];
      }
    })
  );

  return Object.fromEntries(pairs); // { key: signedUrl }
}
