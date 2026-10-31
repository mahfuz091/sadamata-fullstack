/**
 * Split of the ABOVE-THRESHOLD excess of a line (unitPrice − MerchantBonusRule
 * .priceThreshold, times quantity), as percentages of the excess slice only.
 *
 * - Brand products use a FIXED split decided by Brand.isExclusive.
 * - No-brand products keep the legacy behaviour: the merchant takes
 *   MerchantBonusRule.excessPct, no brand share, and the platform absorbs the
 *   remainder.
 *
 * Keep this file byte-identical across frontend/, merchant/ and dashboard/.
 */
export const EXCLUSIVE_EXCESS_SPLIT = { brand: 60, merchant: 20, platform: 20 };
export const NON_EXCLUSIVE_EXCESS_SPLIT = { brand: 40, merchant: 30, platform: 30 };

const toPct = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function resolveExcessSplit({ hasBrand, isExclusive, excessPctRule = 0 } = {}) {
  if (hasBrand) {
    return { ...(isExclusive ? EXCLUSIVE_EXCESS_SPLIT : NON_EXCLUSIVE_EXCESS_SPLIT) };
  }
  const merchant = toPct(excessPctRule);
  return { brand: 0, merchant, platform: Math.max(0, 100 - merchant) };
}
