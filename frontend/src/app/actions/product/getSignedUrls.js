"use server";

import { getPrivateUrl } from "@/lib/s3";
import { filterPublicImageKeys } from "@/lib/publicImageKeys";

export async function getSignedUrls(keys = []) {
  const allowed = await filterPublicImageKeys(keys);

  const entries = await Promise.all(
    keys.map(async (key) => {
      if (!key || !allowed.has(String(key))) return [key, null];
      try {
        const url = await getPrivateUrl(key, 604800); // 7 days max
        return [key, url];
      } catch {
        return [key, null];
      }
    })
  );
  return Object.fromEntries(entries);
}
