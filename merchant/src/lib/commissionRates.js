import { prisma } from "@/lib/prisma";

/**
 * Single source of truth for the commission rates that get FROZEN onto
 * Product.brandCommissionPct / Product.merchantCommissionPct at create time.
 *
 * frontend/src/lib/settlement.js pays out on that frozen snapshot, so whatever
 * is resolved here is what a brand/merchant actually earns per sale.
 *
 * Rate sources, highest priority first:
 *
 *   brandPct    (only meaningful when the product is published under a brand)
 *     1. CommissionSetting { merchantId, brandId }  -> brandCommissionPct   (merchant+brand pair rule)
 *     2. CommissionSetting { merchantId: null, brandId } -> brandCommissionPct  (brand rule, admin editable)
 *     3. Brand.defaultBrandPct
 *     4. Brand.isExclusive ? 10 : 6
 *     no brand -> 0
 *
 *   merchantPct
 *     with a brand:
 *       1. CommissionSetting { merchantId, brandId }  -> brandSelectedMerchantPct
 *       2. CommissionSetting { merchantId, brandId: null } -> brandSelectedMerchantPct
 *       3. 6
 *     without a brand:
 *       1. CommissionSetting { merchantId, brandId: null } -> merchantCommissionPct
 *       2. 11
 */

export const EXCLUSIVE_BRAND_PCT = 10;
export const NON_EXCLUSIVE_BRAND_PCT = 6;
export const FALLBACK_MERCHANT_PCT = 11;
export const FALLBACK_BRAND_SELECTED_MERCHANT_PCT = 6;

const validPct = (v) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100 ? v : null;

const firstPct = (...values) => {
  for (const v of values) {
    const n = validPct(v);
    if (n !== null) return n;
  }
  return null;
};

/** Rate a brand should earn when nothing more specific is configured. */
export function brandFallbackPct(brand) {
  return (
    firstPct(brand?.defaultBrandPct) ??
    (brand?.isExclusive ? EXCLUSIVE_BRAND_PCT : NON_EXCLUSIVE_BRAND_PCT)
  );
}

const activeRule = (db, where) =>
  db.commissionSetting.findFirst({
    where: { isActive: true, productId: null, ...where },
    orderBy: { effectiveFrom: "desc" },
  });

export async function resolveEffectiveCommissions({
  merchantId,
  brandId,
  db = prisma,
}) {
  const merchantRule = await activeRule(db, { merchantId, brandId: null });

  // ---- no brand: merchant sells standalone, nobody earns a brand royalty ----
  if (!brandId) {
    return clampBuckets({
      brandPct: 0,
      merchantPct:
        firstPct(merchantRule?.merchantCommissionPct) ?? FALLBACK_MERCHANT_PCT,
      source: merchantRule ? "merchant-only rule" : "hard fallback",
    });
  }

  // ---- published under a brand ----
  const [pairRule, brandRule, brand] = await Promise.all([
    activeRule(db, { merchantId, brandId }),
    activeRule(db, { merchantId: null, brandId }),
    db.brand.findUnique({
      where: { id: brandId },
      select: { defaultBrandPct: true, isExclusive: true },
    }),
  ]);

  const brandPct =
    firstPct(
      pairRule?.brandCommissionPct,
      brandRule?.brandCommissionPct,
      brand?.defaultBrandPct,
    ) ?? brandFallbackPct(brand);

  const merchantPct =
    firstPct(
      pairRule?.brandSelectedMerchantPct,
      merchantRule?.brandSelectedMerchantPct,
    ) ?? FALLBACK_BRAND_SELECTED_MERCHANT_PCT;

  const brandSource = validPct(pairRule?.brandCommissionPct)
    ? "merchant+brand rule"
    : validPct(brandRule?.brandCommissionPct)
      ? "brand rule"
      : validPct(brand?.defaultBrandPct)
        ? "brand default"
        : "exclusivity fallback";

  return clampBuckets({
    brandPct,
    merchantPct,
    source: `${brandSource} (brand) + ${
      validPct(pairRule?.brandSelectedMerchantPct)
        ? "merchant+brand rule"
        : validPct(merchantRule?.brandSelectedMerchantPct)
          ? "merchant rule"
          : "hard fallback"
    } (merchant)`,
  });
}

/** brandPct + merchantPct must leave a non-negative platform remainder. */
function clampBuckets({ brandPct, merchantPct, source }) {
  if (brandPct + merchantPct > 100) {
    console.warn(
      `[commission] rates exceed 100% (brand ${brandPct} + merchant ${merchantPct}) via ${source}; clamping merchant share`,
    );
    merchantPct = Math.max(0, 100 - brandPct);
  }
  return { brandPct, merchantPct, source };
}
