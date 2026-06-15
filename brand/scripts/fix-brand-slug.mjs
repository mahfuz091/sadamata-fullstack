// Recompute brandSlug for all brands; update only where new slug differs.
// Safe: latin-name slugs unchanged by the Bangla-aware slugify, so only Bangla/unicode names move.
// Run: node scripts/fix-brand-slug.mjs
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { slugify } from "../src/lib/brandSlug.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, brandSlug: true },
    orderBy: { createdAt: "asc" },
  });

  // slugs that stay put
  const used = new Set();
  const toChange = [];
  for (const b of brands) {
    const want = slugify(b.name);
    if (want === b.brandSlug) {
      used.add(b.brandSlug);
    } else {
      toChange.push({ ...b, want });
    }
  }

  for (const b of toChange) {
    let candidate = b.want;
    let n = 1;
    while (used.has(candidate)) {
      n += 1;
      candidate = `${b.want}-${n}`;
    }
    used.add(candidate);
    await prisma.brand.update({
      where: { id: b.id },
      data: { brandSlug: candidate },
    });
    console.log(`${b.name}: ${b.brandSlug} -> ${candidate}`);
  }
  console.log(`Updated ${toChange.length} brand(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
