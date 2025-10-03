// lib/url.js
export function joinUrl(base, path = "") {
  if (!base) throw new Error("Base URL is required");
  const b = String(base).replace(/\/+$/, "");      // trim trailing slashes on base
  if (!path) return b;
  const p = String(path).replace(/^\/+/, "");      // trim leading slashes on path
  return `${b}/${p}`;
}
