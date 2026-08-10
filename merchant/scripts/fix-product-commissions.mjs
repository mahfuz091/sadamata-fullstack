/**
 * Repairs Product.brandCommissionPct / merchantCommissionPct rows that were
 * frozen by the old resolver, which read brandCommissionPct off the MERCHANT
 * commission rule and therefore ignored the brand entirely (exclusive vs
 * non-exclusive, and any admin per-brand setting).
 *
 * Run from the merchant app directory:
 *
 *   node scripts/fix-product-commissions.mjs                 # dry run, prints a diff
 *   node scripts/fix-product-commissions.mjs --apply         # write Product rows
 *   node scripts/fix-product-commissions.mjs --apply --resettle
 *                                                            # also recompute Sale
 *                                                            # earnings for affected
 *                                                            # products (does NOT touch
 *                                                            # Payout rows)
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const APPLY = process.argv.includes("--apply");
const RESETTLE = process.argv.includes("--resettle");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const EXCLUSIVE_BRAND_PCT = 10;
const NON_EXCLUSIVE_BRAND_PCT = 6;
const FALLBACK_MERCHANT_PCT = 11;
const FALLBACK_BRAND_SELECTED_MERCHANT_PCT = 6;

const validPct = (v) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100 ? v : null;

const firstPct = (...values) => {
  for (const v of values) {
    const n = validPct(v);
    if (n !== null) return n;
  }
  return null;
};

const activeRule = (where) =>
  prisma.commissionSetting.findFirst({
    where: { isActive: true, productId: null, ...where },
    orderBy: { effectiveFrom: "desc" },
  });

// Mirror of merchant/src/lib/commissionRates.js
async function resolveEffectiveCommissions({ merchantId, brandId }) {
  const merchantRule = await activeRule({ merchantId, brandId: null });

  if (!brandId) {
    return {
      brandPct: 0,
      merchantPct:
        firstPct(merchantRule?.merchantCommissionPct) ?? FALLBACK_MERCHANT_PCT,
    };
  }

  const [pairRule, brandRule, brand] = await Promise.all([
    activeRule({ merchantId, brandId }),
    activeRule({ merchantId: null, brandId }),
    prisma.brand.findUnique({
      where: { id: brandId },
      select: { defaultBrandPct: true, isExclusive: true },
    }),
  ]);

  const brandPct =
    firstPct(
      pairRule?.brandCommissionPct,
      brandRule?.brandCommissionPct,
      brand?.defaultBrandPct,
    ) ?? (brand?.isExclusive ? EXCLUSIVE_BRAND_PCT : NON_EXCLUSIVE_BRAND_PCT);

  let merchantPct =
    firstPct(
      pairRule?.brandSelectedMerchantPct,
      merchantRule?.brandSelectedMerchantPct,
    ) ?? FALLBACK_BRAND_SELECTED_MERCHANT_PCT;

  if (brandPct + merchantPct > 100) merchantPct = Math.max(0, 100 - brandPct);

  return { brandPct, merchantPct };
}

const round2 = (n) => Math.round(n * 100) / 100;

async function main() {
  console.log(
    `mode: ${APPLY ? "APPLY" : "DRY RUN"}${RESETTLE ? " + RESETTLE" : ""}\n`,
  );

  // --- brands whose stored default disagrees with their exclusivity ---
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, isExclusive: true, defaultBrandPct: true },
  });
  const brandMismatches = brands.filter(
    (b) =>
      b.defaultBrandPct !==
      (b.isExclusive ? EXCLUSIVE_BRAND_PCT : NON_EXCLUSIVE_BRAND_PCT),
  );
  if (brandMismatches.length) {
    console.log(
      `Brands whose defaultBrandPct != exclusivity default (review manually — an admin may have set these deliberately):`,
    );
    for (const b of brandMismatches) {
      console.log(
        `  ${b.name} (${b.id}) exclusive=${b.isExclusive} defaultBrandPct=${b.defaultBrandPct}`,
      );
    }
    console.log("");
  }

  // --- products ---
  const products = await prisma.product.findMany({
    select: {
      id: true,
      productId: true,
      title: true,
      userId: true,
      brandId: true,
      brandCommissionPct: true,
      merchantCommissionPct: true,
    },
  });

  const changes = [];
  for (const p of products) {
    const { brandPct, merchantPct } = await resolveEffectiveCommissions({
      merchantId: p.userId,
      brandId: p.brandId,
    });
    if (
      p.brandCommissionPct !== brandPct ||
      p.merchantCommissionPct !== merchantPct
    ) {
      changes.push({ product: p, brandPct, merchantPct });
    }
  }

  console.log(
    `${changes.length} of ${products.length} products have a stale frozen rate.`,
  );
  for (const c of changes) {
    console.log(
      `  ${c.product.productId ?? c.product.id} brand=${c.product.brandId ?? "none"} ` +
        `brandPct ${c.product.brandCommissionPct} -> ${c.brandPct}, ` +
        `merchantPct ${c.product.merchantCommissionPct} -> ${c.merchantPct}`,
    );
  }

  if (!changes.length) {
    await prisma.$disconnect();
    return;
  }

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply.");
    await prisma.$disconnect();
    return;
  }

  for (const c of changes) {
    await prisma.product.update({
      where: { id: c.product.id },
      data: {
        brandCommissionPct: c.brandPct,
        merchantCommissionPct: c.merchantPct,
      },
    });
  }
  console.log(`\nUpdated ${changes.length} products.`);

  if (!RESETTLE) {
    console.log(
      "Existing Sale rows still hold the old split — re-run with --resettle to recompute them.",
    );
    await prisma.$disconnect();
    return;
  }

  // --- recompute already-settled Sale rows for the corrected products ---
  const rateByProduct = new Map(
    changes.map((c) => [
      c.product.id,
      { brandPct: c.brandPct, merchantPct: c.merchantPct },
    ]),
  );

  const sales = await prisma.sale.findMany({
    where: { productId: { in: [...rateByProduct.keys()] } },
    select: {
      id: true,
      productId: true,
      total: true,
      brandEarning: true,
      merchantEarning: true,
      platformEarning: true,
    },
  });

  let resettled = 0;
  for (const s of sales) {
    const { brandPct, merchantPct } = rateByProduct.get(s.productId);
    const total = Number(s.total);
    const brandEarning = round2((total * brandPct) / 100);
    const merchantEarning = round2((total * merchantPct) / 100);
    const platformEarning = round2(total - brandEarning - merchantEarning);

    if (
      Number(s.brandEarning) === brandEarning &&
      Number(s.merchantEarning) === merchantEarning &&
      Number(s.platformEarning) === platformEarning
    ) {
      continue;
    }

    console.log(
      `  sale ${s.id}: brand ${s.brandEarning} -> ${brandEarning}, ` +
        `merchant ${s.merchantEarning} -> ${merchantEarning}, ` +
        `platform ${s.platformEarning} -> ${platformEarning}`,
    );

    await prisma.sale.update({
      where: { id: s.id },
      data: { brandEarning, merchantEarning, platformEarning },
    });
    resettled += 1;
  }

  console.log(
    `\nRecomputed ${resettled} sales. Payout rows were NOT touched — reconcile ` +
      `already-paid balances by hand.`,
  );

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
