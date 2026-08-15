import prisma from "@/lib/prisma";

/**
 * Resolves the commission percentages in force AT A GIVEN INSTANT.
 *
 * This is the money path. settleOrderEarnings() calls it once per
 * (merchant, brand) pair and freezes the resulting BDT amounts onto Sale.
 *
 * Product.brandCommissionPct / merchantCommissionPct are NO LONGER the source
 * of truth — they are only a last-resort fallback for products whose brand or
 * merchant has no rule at all. A rate change now applies to every sale that
 * settles after it, without touching existing products.
 *
 * Priority, highest first:
 *
 *   brandPct
 *     Brand.isExclusive -> brand rule { brandId, merchantId: null }
 *                       -> Brand.defaultBrandPct
 *                       -> Product.brandCommissionPct
 *                       -> 10
 *     otherwise         -> pair rule  { brandId, merchantId }
 *                       -> brand rule { brandId, merchantId: null }
 *                       -> Brand.defaultBrandPct
 *                       -> Product.brandCommissionPct
 *                       -> 6
 *     no brandId        -> 0   (nobody could be paid a brand royalty)
 *
 *   merchantPct  (same cascade whether or not the brand is exclusive —
 *   brandSelectedMerchantPct is non-nullable with @default(6.0), so letting the
 *   brand rule win would silently drop every exclusive brand's merchants to 6%)
 *     with a brand    -> pair rule.brandSelectedMerchantPct
 *                     -> merchant rule.brandSelectedMerchantPct
 *                     -> Product.merchantCommissionPct
 *                     -> 6
 *     without a brand -> merchant rule.merchantCommissionPct
 *                     -> Product.merchantCommissionPct
 *                     -> 11
 */

export const EXCLUSIVE_BRAND_PCT = 10;
export const NON_EXCLUSIVE_BRAND_PCT = 6;
export const FALLBACK_MERCHANT_PCT = 11;
export const FALLBACK_BRAND_SELECTED_MERCHANT_PCT = 6;

const validPct = (v) => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100
    ? n
    : null;
};

/** first usable percentage, plus which source it came from */
const pick = (candidates) => {
  for (const [source, value] of candidates) {
    const n = validPct(value);
    if (n !== null) return { pct: n, source };
  }
  return null;
};

/**
 * The rule live at `at`.
 *
 * The effectiveFrom/effectiveTo window is the source of truth, NOT isActive.
 * isActive is a current-state flag: a rule that was live when an old order was
 * placed has isActive=false today, and a re-settle of that order must still
 * find it. Admin updates already stamp effectiveTo = now on deactivate, so the
 * window is complete.
 */
function ruleAt(db, at, scope) {
  return db.commissionSetting.findFirst({
    where: {
      productId: null,
      ...scope,
      effectiveFrom: { lte: at },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: at } }],
    },
    // legacy rows can overlap (duplicated, effectiveTo left null) — newest wins
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
}

export async function resolveCommissionAt({
  merchantId,
  brandId = null,
  at,
  product = null,
  db = prisma,
}) {
  const when = at instanceof Date ? at : new Date(at);

  // ---- standalone merchant sale: no brand, so no brand royalty ----
  if (!brandId) {
    const merchantRule = merchantId
      ? await ruleAt(db, when, { merchantId, brandId: null })
      : null;

    const merchant = pick([
      ["merchant rule", merchantRule?.merchantCommissionPct],
      ["product snapshot", product?.merchantCommissionPct],
    ]) ?? { pct: FALLBACK_MERCHANT_PCT, source: "system fallback" };

    return clamp({
      brandPct: 0,
      brandSource: "no brand",
      merchantPct: merchant.pct,
      merchantSource: merchant.source,
      isExclusive: false,
    });
  }

  // ---- published under a brand ----
  const [pairRule, brandRule, merchantRule, brand] = await Promise.all([
    merchantId ? ruleAt(db, when, { merchantId, brandId }) : null,
    ruleAt(db, when, { merchantId: null, brandId }),
    merchantId ? ruleAt(db, when, { merchantId, brandId: null }) : null,
    db.brand.findUnique({
      where: { id: brandId },
      select: { defaultBrandPct: true, isExclusive: true },
    }),
  ]);

  const isExclusive = Boolean(brand?.isExclusive);

  const brandHit = pick(
    isExclusive
      ? [
          ["brand rule (exclusive)", brandRule?.brandCommissionPct],
          ["brand default", brand?.defaultBrandPct],
          ["product snapshot", product?.brandCommissionPct],
        ]
      : [
          ["merchant + brand rule", pairRule?.brandCommissionPct],
          ["brand rule", brandRule?.brandCommissionPct],
          ["brand default", brand?.defaultBrandPct],
          ["product snapshot", product?.brandCommissionPct],
        ],
  ) ?? {
    pct: isExclusive ? EXCLUSIVE_BRAND_PCT : NON_EXCLUSIVE_BRAND_PCT,
    source: "system fallback",
  };

  const merchantHit = pick([
    ["merchant + brand rule", pairRule?.brandSelectedMerchantPct],
    ["merchant rule", merchantRule?.brandSelectedMerchantPct],
    ["product snapshot", product?.merchantCommissionPct],
  ]) ?? {
    pct: FALLBACK_BRAND_SELECTED_MERCHANT_PCT,
    source: "system fallback",
  };

  return clamp({
    brandPct: brandHit.pct,
    brandSource: brandHit.source,
    merchantPct: merchantHit.pct,
    merchantSource: merchantHit.source,
    isExclusive,
  });
}

function clamp(result) {
  const { brandPct } = result;
  let { merchantPct } = result;
  let clamped = false;

  if (brandPct + merchantPct > 100) {
    merchantPct = Math.max(0, 100 - brandPct);
    clamped = true;
  }

  return {
    ...result,
    merchantPct,
    clamped,
    platformPct: Math.max(0, 100 - brandPct - merchantPct),
  };
}
