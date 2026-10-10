/**
 * Idempotent seed for the tiered merchant commission rule.
 *
 * Run from the merchant app directory:
 *
 *   node scripts/seed-merchant-bonus-rule.mjs            # apply
 *   node scripts/seed-merchant-bonus-rule.mjs --dry-run  # print only, write nothing
 *
 * - creates one active MerchantBonusRule (1000 / 40) if none exists
 * - creates the partial unique index that enforces a single active rule
 * - never touches Sale / Refund / Payout rows
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const DRY = process.argv.includes("--dry-run");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_THRESHOLD = 1000;
const DEFAULT_EXCESS_PCT = 40;

async function main() {
  const existing = await prisma.merchantBonusRule.findFirst({
    where: { isActive: true },
  });

  if (existing) {
    console.log(
      `[seed] active MerchantBonusRule already exists (threshold=${existing.priceThreshold}, excess=${existing.excessPct}%) — nothing to insert.`,
    );
  } else if (DRY) {
    console.log(
      `[seed] would create MerchantBonusRule { priceThreshold: ${DEFAULT_THRESHOLD}, excessPct: ${DEFAULT_EXCESS_PCT}, isActive: true }`,
    );
  } else {
    const created = await prisma.merchantBonusRule.create({
      data: {
        priceThreshold: DEFAULT_THRESHOLD,
        excessPct: DEFAULT_EXCESS_PCT,
        isActive: true,
        note: "seed default",
      },
    });
    console.log(`[seed] created MerchantBonusRule ${created.id} (1000 / 40).`);
  }

  if (DRY) {
    console.log(
      '[seed] would ensure partial unique index "MerchantBonusRule_one_active".',
    );
  } else {
    await prisma.$executeRawUnsafe(
      'CREATE UNIQUE INDEX IF NOT EXISTS "MerchantBonusRule_one_active" ON "MerchantBonusRule" ("isActive") WHERE "isActive" = true;',
    );
    console.log(
      '[seed] ensured partial unique index "MerchantBonusRule_one_active".',
    );
  }

  console.log("[seed] Sale / Refund / Payout rows were not touched.");
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
