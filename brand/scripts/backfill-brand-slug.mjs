// One-time backfill: give every existing Brand a brandSlug.
// Run AFTER `npx prisma db push`:  node scripts/backfill-brand-slug.mjs
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { slugify } from "../src/lib/brandSlug.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const brands = await prisma.brand.findMany({
    where: { brandSlug: null },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Brands missing slug: ${brands.length}`);
  const used = new Set();
  // seed with already-assigned slugs so we never collide
  const existing = await prisma.brand.findMany({
    where: { brandSlug: { not: null } },
    select: { brandSlug: true },
  });
  existing.forEach((b) => used.add(b.brandSlug));

  for (const b of brands) {
    const base = slugify(b.name);
    let candidate = base;
    let n = 1;
    while (used.has(candidate)) {
      n += 1;
      candidate = `${base}-${n}`;
    }
    used.add(candidate);
    await prisma.brand.update({
      where: { id: b.id },
      data: { brandSlug: candidate },
    });
    console.log(`${b.name} -> ${candidate}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
