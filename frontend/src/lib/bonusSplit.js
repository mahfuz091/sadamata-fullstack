import { Prisma } from "@/generated/prisma";

const D = Prisma.Decimal;
const ZERO = new D(0);

/**
 * Scenario-based split of the ABOVE-THRESHOLD excess of an order line
 * ((unitPrice - priceThreshold) x quantity), as percentages of the excess only.
 *
 *   NO_BRAND              brand 0   merchant 60  platform 40   (brandPct must be 0)
 *   NON_EXCLUSIVE_BRAND   brand 40  merchant 30  platform 30
 *   EXCLUSIVE_BRAND       brand 60  merchant 20  platform 20
 *
 * Every percentage and the threshold are admin-editable (BonusRule table) — the
 * values below are only the seeds used when no rule exists yet.
 *
 * Keep this file byte-identical across frontend/, merchant/ and dashboard/.
 */

export const BONUS_SCENARIOS = [
  "NO_BRAND",
  "NON_EXCLUSIVE_BRAND",
  "EXCLUSIVE_BRAND",
];

export const DEFAULT_BONUS_RULES = {
  NO_BRAND: { brandPct: 0, merchantPct: 60, platformPct: 40 },
  NON_EXCLUSIVE_BRAND: { brandPct: 40, merchantPct: 30, platformPct: 30 },
  EXCLUSIVE_BRAND: { brandPct: 60, merchantPct: 20, platformPct: 20 },
};

const toDec = (v) => new D(String(v ?? 0));
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Which scenario a line falls into, from the product/brand. */
export function resolveBonusScenario({ brandId, brandIsExclusive } = {}) {
  if (!brandId) return "NO_BRAND";
  return brandIsExclusive ? "EXCLUSIVE_BRAND" : "NON_EXCLUSIVE_BRAND";
}

/** Validate an admin-editable rule -> { ok, errors: string[] }. */
export function validateBonusRule(rule = {}) {
  const errors = [];
  const { scenario, priceThreshold, brandPct, merchantPct, platformPct } = rule;

  if (!BONUS_SCENARIOS.includes(scenario)) {
    errors.push(`scenario must be one of ${BONUS_SCENARIOS.join(", ")}`);
  }

  for (const [key, value] of Object.entries({ brandPct, merchantPct, platformPct })) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      errors.push(`${key} must be a number between 0 and 100`);
    }
  }

  const sum = toNum(brandPct) + toNum(merchantPct) + toNum(platformPct);
  if (Math.abs(sum - 100) > 1e-9) {
    errors.push("brandPct + merchantPct + platformPct must equal exactly 100");
  }

  if (scenario === "NO_BRAND" && toNum(brandPct) !== 0) {
    errors.push("NO_BRAND rules must have brandPct = 0");
  }

  if (priceThreshold != null) {
    const t = Number(priceThreshold);
    if (!Number.isFinite(t) || t < 0) errors.push("priceThreshold must be >= 0");
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Split the excess of one order line.
 *
 * `rule` = { id, priceThreshold, brandPct, merchantPct, platformPct } | null,
 * already resolved for the line's scenario. All money is Prisma.Decimal rounded
 * to 2 decimals; the rounding remainder goes to the platform so the three parts
 * sum exactly to the excess. Returns all zeros when the line is at/below the
 * threshold or no rule applies. Never throws — checkout must not break.
 */
export function calculateBonusSplit({
  unitPrice,
  quantity,
  brandId,
  brandIsExclusive,
  rule,
} = {}) {
  const scenario = resolveBonusScenario({ brandId, brandIsExclusive });
  const unit = toDec(unitPrice);
  const qty = toDec(quantity);

  if (!rule || rule.priceThreshold == null) {
    if (!rule) {
      console.warn(`[bonus] no active ${scenario} rule; paying no excess bonus`);
    }
    return {
      scenario,
      excess: ZERO,
      brandExcess: ZERO,
      merchantExcess: ZERO,
      platformExcess: ZERO,
      pctApplied: { brand: 0, merchant: 0, platform: 0 },
      thresholdApplied: null,
      bonusRuleId: null,
    };
  }

  const threshold = toDec(rule.priceThreshold);
  const excess = D.max(unit.sub(threshold), ZERO).mul(qty).toDecimalPlaces(2);

  const pctApplied = {
    brand: toNum(rule.brandPct),
    merchant: toNum(rule.merchantPct),
    platform: toNum(rule.platformPct),
  };

  if (excess.lte(0)) {
    return {
      scenario,
      excess: ZERO,
      brandExcess: ZERO,
      merchantExcess: ZERO,
      platformExcess: ZERO,
      pctApplied,
      thresholdApplied: threshold,
      bonusRuleId: rule.id ?? null,
    };
  }

  const brandExcess = excess.mul(toDec(rule.brandPct)).div(100).toDecimalPlaces(2);
  const merchantExcess = excess.mul(toDec(rule.merchantPct)).div(100).toDecimalPlaces(2);
  // Platform absorbs the rounding remainder so the parts sum exactly to excess.
  const platformExcess = excess.sub(brandExcess).sub(merchantExcess);

  return {
    scenario,
    excess,
    brandExcess,
    merchantExcess,
    platformExcess,
    pctApplied,
    thresholdApplied: threshold,
    bonusRuleId: rule.id ?? null,
  };
}

/**
 * Proportionally reverse the recorded excess of a sale — from the SALE snapshot,
 * never the live rule. `refundQty` is clamped to [0, soldQty] so nothing more
 * than was earned can be reversed.
 */
export function prorateExcessRefund({
  soldQty,
  refundQty,
  brandExcess,
  merchantExcess,
  platformExcess,
} = {}) {
  const sold = toDec(soldQty);
  const want = toDec(refundQty);
  const ratio = sold.gt(0) ? D.min(D.max(want, ZERO), sold).div(sold) : ZERO;
  const scale = (v) => toDec(v).mul(ratio).toDecimalPlaces(2);

  return {
    brandExcessReversed: scale(brandExcess),
    merchantExcessReversed: scale(merchantExcess),
    platformExcessReversed: scale(platformExcess),
  };
}
