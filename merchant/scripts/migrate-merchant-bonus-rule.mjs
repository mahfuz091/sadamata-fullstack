/**
 * One-off migration: MerchantBonusRule -> scenario-based BonusRule.
 *
 * Run from the merchant app directory, AFTER `prisma db push` has created the
 * BonusRule table and BEFORE MerchantBonusRule is dropped from the schema:
 *
 *   node scripts/migrate-merchant-bonus-rule.mjs            # apply
 *   node scripts/migrate-merchant-bonus-rule.mjs --dry-run  # print only
 *
 * - copies the active MerchantBonusRule into a NO_BRAND BonusRule
 *   (brandPct 0, merchantPct = excessPct, platformPct = 100 - excessPct)
 * - seeds NON_EXCLUSIVE_BRAND (40/30/30) and EXCLUSIVE_BRAND (60/20/20) if absent
 * - ensures a NO_BRAND rule exists (default 0/60/40) when nothing was copied
 * - ensures the one-active-rule-per-scenario partial unique index
 * - idempotent; never touches Sale / Refund / Payout rows
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const DRY = process.argv.includes("--dry-run");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEEDS = {
  NO_BRAND: { brandPct: 0, merchantPct: 60, platformPct: 40 },
  NON_EXCLUSIVE_BRAND: { brandPct: 40, merchantPct: 30, platformPct: 30 },
  EXCLUSIVE_BRAND: { brandPct: 60, merchantPct: 20, platformPct: 20 },
};

async function hasActive(scenario) {
  const n = await prisma.bonusRule.count({
    where: { scenario, isActive: true },
  });
  return n > 0;
}

async function ensureRule(scenario, values, note) {
  if (await hasActive(scenario)) {
    console.log(`[migrate] ${scenario} already has an active rule — skipping.`);
    return;
  }

  const data = { scenario, isActive: true, note, ...values };

  if (DRY) {
    console.log(`[migrate] would create ${scenario}:`, {
      priceThreshold: Number(data.priceThreshold),
      brandPct: Number(data.brandPct),
      merchantPct: Number(data.merchantPct),
      platformPct: Number(data.platformPct),
    });
    return;
  }

  const created = await prisma.bonusRule.create({ data });
  console.log(
    `[migrate] created ${scenario} rule ${created.id} ` +
      `(${Number(created.priceThreshold)} BDT threshold, ` +
      `${Number(created.brandPct)}/${Number(created.merchantPct)}/${Number(created.platformPct)}).`,
  );
}

async function main() {
  // 1) Copy the active MerchantBonusRule into NO_BRAND.
  let legacy = null;
  try {
    legacy = await prisma.merchantBonusRule.findFirst({
      where: { isActive: true },
      orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("[migrate] MerchantBonusRule not readable:", err?.message);
  }

  if (legacy) {
    const merchantPct = Number(legacy.excessPct);
    await ensureRule(
      "NO_BRAND",
      {
        priceThreshold: legacy.priceThreshold,
        brandPct: 0,
        merchantPct,
        platformPct: 100 - merchantPct,
      },
      "migrated from MerchantBonusRule",
    );
  } else {
    console.log("[migrate] no active MerchantBonusRule found.");
  }

  // 2) Seed the two brand scenarios (NO_BRAND covers the "nothing to copy" case).
  await ensureRule("NO_BRAND", { priceThreshold: 1000, ...SEEDS.NO_BRAND }, "seed default");
  await ensureRule(
    "NON_EXCLUSIVE_BRAND",
    { priceThreshold: 1000, ...SEEDS.NON_EXCLUSIVE_BRAND },
    "seed default",
  );
  await ensureRule(
    "EXCLUSIVE_BRAND",
    { priceThreshold: 1000, ...SEEDS.EXCLUSIVE_BRAND },
    "seed default",
  );

  // 3) One active rule per scenario.
  if (DRY) {
    console.log(
      '[migrate] would ensure partial unique index "BonusRule_one_active_per_scenario".',
    );
  } else {
    await prisma.$executeRawUnsafe(
      'CREATE UNIQUE INDEX IF NOT EXISTS "BonusRule_one_active_per_scenario" ON "BonusRule" ("scenario") WHERE "isActive" = true;',
    );
    console.log(
      '[migrate] ensured partial unique index "BonusRule_one_active_per_scenario".',
    );
  }

  console.log("[migrate] Sale / Refund / Payout rows were not touched.");
}

main()
  .catch((err) => {
    console.error("[migrate] failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
