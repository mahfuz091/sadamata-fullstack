import { describe, it, expect } from "vitest";
import {
  calculateBonusSplit,
  resolveBonusScenario,
  validateBonusRule,
} from "@/lib/bonusSplit";

// Decimal -> plain 2dp number
const n = (d) => Number(Number(d).toFixed(2));

const NO_BRAND = { id: "r-nb", priceThreshold: 1000, brandPct: 0, merchantPct: 60, platformPct: 40 };
const NON_EXCL = { id: "r-ne", scenario: "NON_EXCLUSIVE_BRAND", priceThreshold: 1000, brandPct: 40, merchantPct: 30, platformPct: 30 };
const EXCL = { id: "r-ex", priceThreshold: 1000, brandPct: 60, merchantPct: 20, platformPct: 20 };

const brand = { brandId: "b1" };

describe("resolveBonusScenario", () => {
  it("no brand -> NO_BRAND", () => {
    expect(resolveBonusScenario({ brandId: null })).toBe("NO_BRAND");
    expect(resolveBonusScenario({})).toBe("NO_BRAND");
  });
  it("brand + exclusive flag", () => {
    expect(resolveBonusScenario({ brandId: "b1", brandIsExclusive: true })).toBe("EXCLUSIVE_BRAND");
    expect(resolveBonusScenario({ brandId: "b1", brandIsExclusive: false })).toBe("NON_EXCLUSIVE_BRAND");
  });
});

describe("calculateBonusSplit", () => {
  it("below the threshold -> all zeros", () => {
    const s = calculateBonusSplit({ unitPrice: 999, quantity: 1, rule: NO_BRAND });
    expect(n(s.excess)).toBe(0);
    expect(n(s.brandExcess)).toBe(0);
    expect(n(s.merchantExcess)).toBe(0);
    expect(n(s.platformExcess)).toBe(0);
    expect(s.scenario).toBe("NO_BRAND");
  });

  it("exactly at the threshold -> all zeros", () => {
    const s = calculateBonusSplit({ unitPrice: 1000, quantity: 1, rule: EXCL, ...brand, brandIsExclusive: true });
    expect(n(s.excess)).toBe(0);
    expect(n(s.merchantExcess)).toBe(0);
    expect(n(s.thresholdApplied)).toBe(1000);
  });

  it("NO_BRAND, 1500 -> 500 excess split 0/60/40", () => {
    const s = calculateBonusSplit({ unitPrice: 1500, quantity: 1, rule: NO_BRAND });
    expect(n(s.excess)).toBe(500);
    expect(n(s.brandExcess)).toBe(0);
    expect(n(s.merchantExcess)).toBe(300);
    expect(n(s.platformExcess)).toBe(200);
    expect(s.bonusRuleId).toBe("r-nb");
  });

  it("NON_EXCLUSIVE_BRAND, 1500 -> 500 excess split 40/30/30", () => {
    const s = calculateBonusSplit({
      unitPrice: 1500,
      quantity: 1,
      rule: NON_EXCL,
      ...brand,
      brandIsExclusive: false,
    });
    expect(s.scenario).toBe("NON_EXCLUSIVE_BRAND");
    expect(n(s.brandExcess)).toBe(200);
    expect(n(s.merchantExcess)).toBe(150);
    expect(n(s.platformExcess)).toBe(150);
  });

  it("EXCLUSIVE_BRAND, 1500 -> 500 excess split 60/20/20", () => {
    const s = calculateBonusSplit({
      unitPrice: 1500,
      quantity: 1,
      rule: EXCL,
      ...brand,
      brandIsExclusive: true,
    });
    expect(n(s.brandExcess)).toBe(300);
    expect(n(s.merchantExcess)).toBe(100);
    expect(n(s.platformExcess)).toBe(100);
  });

  it("rounding: excess 333.33 for 60/20/20 -> parts sum exactly to the excess", () => {
    const s = calculateBonusSplit({
      unitPrice: 1333.33,
      quantity: 1,
      rule: EXCL,
      ...brand,
      brandIsExclusive: true,
    });
    expect(n(s.excess)).toBe(333.33);
    expect(n(s.brandExcess)).toBe(200);
    expect(n(s.merchantExcess)).toBe(66.67);
    // platform absorbs the remainder (333.33 - 200 - 66.67)
    expect(n(s.platformExcess)).toBe(66.66);
    // exact at the Decimal level — the parts sum to the excess with no drift
    expect(
      s.brandExcess.add(s.merchantExcess).add(s.platformExcess).equals(s.excess),
    ).toBe(true);
  });

  it("quantity multiplies the excess", () => {
    const s = calculateBonusSplit({ unitPrice: 1500, quantity: 2, rule: NO_BRAND });
    expect(n(s.excess)).toBe(1000);
    expect(n(s.merchantExcess)).toBe(600);
    expect(n(s.platformExcess)).toBe(400);
  });

  it("no rule -> zeros and never throws", () => {
    expect(() => calculateBonusSplit({ unitPrice: 1500, quantity: 1, rule: null })).not.toThrow();
    const s = calculateBonusSplit({ unitPrice: 1500, quantity: 1, rule: null });
    expect(n(s.excess)).toBe(0);
    expect(n(s.merchantExcess)).toBe(0);
    expect(n(s.platformExcess)).toBe(0);
    expect(s.bonusRuleId).toBe(null);
    expect(() => calculateBonusSplit()).not.toThrow();
  });

  it("exposes the pct applied for the snapshot", () => {
    const s = calculateBonusSplit({
      unitPrice: 1500,
      quantity: 1,
      rule: EXCL,
      ...brand,
      brandIsExclusive: true,
    });
    expect(s.pctApplied).toEqual({ brand: 60, merchant: 20, platform: 20 });
  });
});

describe("validateBonusRule", () => {
  it("accepts a balanced rule", () => {
    expect(validateBonusRule(NON_EXCL).ok).toBe(true);
  });

  it("rejects a sum that is not exactly 100", () => {
    const res = validateBonusRule({ scenario: "NON_EXCLUSIVE_BRAND", brandPct: 40, merchantPct: 40, platformPct: 40 });
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/100/);
  });

  it("rejects NO_BRAND with a non-zero brand share", () => {
    const res = validateBonusRule({ scenario: "NO_BRAND", brandPct: 10, merchantPct: 50, platformPct: 40 });
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/NO_BRAND/);
  });

  it("rejects unknown scenarios and out-of-range percentages", () => {
    expect(validateBonusRule({ scenario: "NOPE", brandPct: 0, merchantPct: 60, platformPct: 40 }).ok).toBe(false);
    expect(validateBonusRule({ scenario: "NO_BRAND", brandPct: 0, merchantPct: 120, platformPct: -20 }).ok).toBe(false);
  });
});
