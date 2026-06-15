// Brand slug helpers.
// slugify("ALNA") -> "alna". Generates a unique brandSlug, appending -2, -3 ... on collision.

export function slugify(input) {
  // Keep latin a-z0-9 AND Bangla letters (U+0980-U+09FF). Each word separated by "-".
  const base = String(input ?? "")
    .toLowerCase() // no-op for Bangla, lowercases latin
    .trim()
    .replace(/[^a-z0-9ঀ-৿]+/g, "-") // anything else -> dash
    .replace(/^-+|-+$/g, "") // trim edge dashes
    .replace(/-{2,}/g, "-"); // collapse repeats
  return base || "brand";
}

// db: prisma client OR a transaction client (tx). Both expose brand.findUnique.
export async function generateBrandSlug(db, name) {
  const base = slugify(name);
  let candidate = base;
  let n = 1;
  // loop until free
  while (true) {
    const hit = await db.brand.findUnique({
      where: { brandSlug: candidate },
      select: { id: true },
    });
    if (!hit) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
