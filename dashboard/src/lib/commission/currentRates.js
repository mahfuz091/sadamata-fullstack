import { prisma } from "../prisma";

/**
 * The commission percentages in force RIGHT NOW for a (merchant, brand) pair.
 *
 * Read-only view for admin screens. It does not touch Product.brandCommissionPct
 * / merchantCommissionPct — those are the snapshot frozen at product creation,
 * and frontend/src/lib/settlement.js is what actually pays on them.
 *
 * Priority, highest first:
 *
 *   brandPct
 *     Brand.isExclusive -> brand rule { brandId, merchantId: null }
 *                       -> Brand.defaultBrandPct
 *                       -> 10
 *     otherwise         -> pair rule  { brandId, merchantId }
 *                       -> brand rule { brandId, merchantId: null }
 *                       -> Brand.defaultBrandPct
 *                       -> 6
 *     no brandId        -> 0
 *
 *   merchantPct (same cascade either way — brandSelectedMerchantPct is
 *   non-nullable with @default(6.0), so "brand rule wins" would silently drop
 *   every exclusive brand's merchants to 6%)
 *     with a brand    -> pair rule.brandSelectedMerchantPct
 *                     -> merchant rule.brandSelectedMerchantPct
 *                     -> 6
 *     without a brand -> merchant rule.merchantCommissionPct
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

/** first usable percentage, plus which argument it came from */
const pick = (candidates) => {
  for (const [source, value] of candidates) {
    const n = validPct(value);
    if (n !== null) return { pct: n, source };
  }
  return null;
};

/**
 * The rule live at `at`. The date window is the source of truth, not isActive —
 * isActive is a current-state flag, and admin updates already stamp
 * effectiveTo = now when they deactivate a rule.
 */
function ruleAt(at, scope) {
  return prisma.commissionSetting.findFirst({
    where: {
      productId: null,
      ...scope,
      effectiveFrom: { lte: at },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: at } }],
    },
    // legacy rows can overlap; newest wins
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
}

export async function resolveCurrentCommission({
  merchantId,
  brandId = null,
  at = new Date(),
}) {
  const when = at instanceof Date ? at : new Date(at);

  // ---- standalone merchant sale, no brand royalty ----
  if (!brandId) {
    const merchantRule = merchantId
      ? await ruleAt(when, { merchantId, brandId: null })
      : null;

    const merchant = pick([
      ["merchant rule", merchantRule?.merchantCommissionPct],
    ]) ?? { pct: FALLBACK_MERCHANT_PCT, source: "system fallback" };

    return clamp({
      brandPct: 0,
      brandSource: "no brand on this product",
      merchantPct: merchant.pct,
      merchantSource: merchant.source,
      isExclusive: false,
      effectiveFrom: merchantRule?.effectiveFrom ?? null,
    });
  }

  // ---- published under a brand ----
  const [pairRule, brandRule, merchantRule, brand] = await Promise.all([
    merchantId ? ruleAt(when, { merchantId, brandId }) : null,
    ruleAt(when, { merchantId: null, brandId }),
    merchantId ? ruleAt(when, { merchantId, brandId: null }) : null,
    prisma.brand.findUnique({
      where: { id: brandId },
      select: { defaultBrandPct: true, isExclusive: true },
    }),
  ]);

  const isExclusive = Boolean(brand?.isExclusive);

  const brandCandidates = isExclusive
    ? [
        ["brand rule (exclusive)", brandRule?.brandCommissionPct],
        ["brand default", brand?.defaultBrandPct],
      ]
    : [
        ["merchant + brand rule", pairRule?.brandCommissionPct],
        ["brand rule", brandRule?.brandCommissionPct],
        ["brand default", brand?.defaultBrandPct],
      ];

  const brandHit = pick(brandCandidates) ?? {
    pct: isExclusive ? EXCLUSIVE_BRAND_PCT : NON_EXCLUSIVE_BRAND_PCT,
    source: "system fallback",
  };

  const merchantHit = pick([
    ["merchant + brand rule", pairRule?.brandSelectedMerchantPct],
    ["merchant rule", merchantRule?.brandSelectedMerchantPct],
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
    effectiveFrom:
      (isExclusive ? brandRule : (pairRule ?? brandRule))?.effectiveFrom ??
      null,
  });
}

function clamp(result) {
  let { brandPct, merchantPct } = result;
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
