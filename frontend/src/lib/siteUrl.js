// Absolute URLs for links that leave the app (emails, cross-portal redirects).
export const PORTAL = "shop";

export const BASE_URL = String(
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
)
  .trim()
  .replace(/\/+$/, "");

export function absoluteUrl(path = "") {
  if (!path) return BASE_URL;
  return `${BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}
