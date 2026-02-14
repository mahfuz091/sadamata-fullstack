function cleanName(name = "file") {
  return String(name)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

export function productKey({ productId, filename }) {
  return `products/${productId}/${Date.now()}-${cleanName(filename)}`;
}

export function designKey({ designId = "general", filename }) {
  return `designs/${designId}/${Date.now()}-${cleanName(filename)}`;
}

export function profileKey({ userId, filename }) {
  const ext = filename?.split(".").pop() || "webp";
  return `profile/${userId}.${ext}`;
}
