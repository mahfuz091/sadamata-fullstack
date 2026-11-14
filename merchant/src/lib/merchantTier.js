import { Prisma } from "@/generated/prisma";

const D = Prisma.Decimal;
const ZERO = new D(0);

const isActiveRule = (rule) =>
  !!rule && rule.isActive !== false && rule.priceThreshold != null;

/**
 * Merchant earning under the scenario-based bonus rule.
 *
 *   base   = min(unitPrice, threshold) * merchantPct/100
 *   excess = max(unitPrice - threshold, 0) * rule.merchantPct/100
 *
 * Both multiplied by `quantity` and rounded to 2 decimals. When the rule is
 * missing or inactive this is exactly the legacy `unitPrice * merchantPct * qty`.
 *
 * `rule` is the BonusRule row already resolved for the line's scenario
 * (see bonusSplit.js / resolveBonusScenario); it carries `merchantPct` for the
 * excess slice. Never throws.
 */
export function calcMerchantEarning(unitPrice, quantity, merchantPct, rule = null) {
  const unit = new D(String(unitPrice ?? 0));
  const qty = new D(String(quantity ?? 0));
  const pct = new D(String(merchantPct ?? 0));

  if (!isActiveRule(rule)) {
    const total = unit.mul(pct).div(100).mul(qty).toDecimalPlaces(2);
    return { baseEarning: total, excessEarning: ZERO, total };
  }

  const threshold = new D(String(rule.priceThreshold));
  const excessPct = new D(String(rule.merchantPct ?? 0));

  const base = D.min(unit, threshold).mul(pct).div(100).mul(qty).toDecimalPlaces(2);
  const excess = D.max(unit.sub(threshold), ZERO)
    .mul(excessPct)
    .div(100)
    .mul(qty)
    .toDecimalPlaces(2);

  return { baseEarning: base, excessEarning: excess, total: base.add(excess) };
}

/**
 * Per-unit preview for the merchant UI. Returns 2-decimal strings plus a
 * ready-to-render sentence.
 */
export function buildMerchantPreview(unitPrice, merchantPct, rule = null) {
  const unit = new D(String(unitPrice ?? 0));
  const { baseEarning, excessEarning, total } = calcMerchantEarning(
    unit,
    1,
    merchantPct,
    rule,
  );
  const active = isActiveRule(rule);

  const threshold = active ? new D(String(rule.priceThreshold)) : ZERO;
  const excessPct = active ? new D(String(rule.merchantPct ?? 0)) : ZERO;

  const text = `At this price you earn ${total.toFixed(2)} BDT per sale`;

  return {
    baseEarning: baseEarning.toFixed(2),
    excessEarning: excessEarning.toFixed(2),
    total: total.toFixed(2),
    threshold: threshold.toFixed(2),
    excessPct: excessPct.toFixed(2),
    text,
  };
}
