"use server";

import { getPrivateUrl } from "@/lib/s3";

export async function getSignedUrls(keys = []) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      if (!key) return [key, null];
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
