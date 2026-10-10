import { Prisma } from "@/generated/prisma";

const D = Prisma.Decimal;
const ZERO = new D(0);

const isActiveRule = (rule) =>
  !!rule &&
  rule.isActive !== false &&
  rule.priceThreshold != null &&
  rule.excessPct != null;

/**
 * Merchant earning under the tiered rule.
 *
 *   base   = min(unitPrice, threshold) * merchantPct/100
 *   excess = max(unitPrice - threshold, 0) * excessPct/100
 *
 * Both multiplied by `quantity` and rounded to 2 decimals. When the rule is
 * missing or inactive this is exactly the legacy `unitPrice * merchantPct * qty`.
 * Never throws. `rule` = { priceThreshold, excessPct, isActive } | null.
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
  const excessPct = new D(String(rule.excessPct));

  const base = D.min(unit, threshold).mul(pct).div(100).mul(qty).toDecimalPlaces(2);
  const excess = D.max(unit.sub(threshold), ZERO)
    .mul(excessPct)
    .div(100)
    .mul(qty)
    .toDecimalPlaces(2);

  return { baseEarning: base, excessEarning: excess, total: base.add(excess) };
}

/**
 * Per-unit preview for the admin UI. Returns 2-decimal strings plus a
 * ready-to-render sentence.
 */
export function buildMerchantPreview(unitPrice, merchantPct, rule = null) {
  const unit = new D(String(unitPrice ?? 0));
  const { baseEarning, excessEarning, total } = calcMerchantEarning(unit, 1, merchantPct, rule);
  const active = isActiveRule(rule);

  const threshold = active ? new D(String(rule.priceThreshold)) : ZERO;
  const excessPct = active ? new D(String(rule.excessPct)) : ZERO;

  let text;
  if (!active) {
    text = `At this price you earn ${total.toFixed(2)} BDT per sale`;
  } else if (excessEarning.gt(0)) {
    text =
      `At this price you earn ${total.toFixed(2)} BDT per sale ` +
      `(${baseEarning.toFixed(2)} base + ${excessEarning.toFixed(2)} from the part above ${threshold.toFixed(2)} BDT)`;
  } else {
    text = `At this price you earn ${total.toFixed(2)} BDT per sale (all of it within the ${threshold.toFixed(2)} BDT base)`;
  }

  return {
    baseEarning: baseEarning.toFixed(2),
    excessEarning: excessEarning.toFixed(2),
    total: total.toFixed(2),
    threshold: threshold.toFixed(2),
    excessPct: excessPct.toFixed(2),
    text,
  };
}
