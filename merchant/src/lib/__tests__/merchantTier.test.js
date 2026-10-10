import { describe, it, expect } from "vitest";
import { calcMerchantEarning, buildMerchantPreview } from "@/lib/merchantTier";

const RULE = { priceThreshold: 1000, excessPct: 40, isActive: true };
const INACTIVE = { priceThreshold: 1000, excessPct: 40, isActive: false };

// Decimal -> plain 2dp number
const n = (d) => Number(d.toFixed(2));

describe("calcMerchantEarning", () => {
  it("equals the legacy calc when the rule is missing", () => {
    const r = calcMerchantEarning(1100, 1, 11, null);
    expect(n(r.baseEarning)).toBe(121);
    expect(n(r.excessEarning)).toBe(0);
    expect(n(r.total)).toBe(121);
  });

  it("equals the legacy calc when the rule is inactive", () => {
    const r = calcMerchantEarning(1100, 1, 11, INACTIVE);
    expect(n(r.total)).toBe(121);
    expect(n(r.excessEarning)).toBe(0);
  });

  describe("merchant 11%", () => {
    const at = (price, qty = 1) => calcMerchantEarning(price, qty, 11, RULE);

    it("price 999 — all inside the base slice", () => {
      const r = at(999);
      expect(n(r.baseEarning)).toBe(109.89);
      expect(n(r.excessEarning)).toBe(0);
      expect(n(r.total)).toBe(109.89);
    });

    it("price 1000 — exactly at threshold", () => {
      const r = at(1000);
      expect(n(r.total)).toBe(110);
      expect(n(r.excessEarning)).toBe(0);
    });

    it("price 1001 — 1 BDT above threshold", () => {
      const r = at(1001);
      expect(n(r.baseEarning)).toBe(110);
      expect(n(r.excessEarning)).toBe(0.4);
      expect(n(r.total)).toBe(110.4);
    });

    it("price 1100 — 110 + 40 = 150", () => {
      const r = at(1100);
      expect(n(r.baseEarning)).toBe(110);
      expect(n(r.excessEarning)).toBe(40);
      expect(n(r.total)).toBe(150);
    });

    it("price 5000 — 110 + 1600 = 1710", () => {
      const r = at(5000);
      expect(n(r.baseEarning)).toBe(110);
      expect(n(r.excessEarning)).toBe(1600);
      expect(n(r.total)).toBe(1710);
    });

    it("quantity multiplies both slices — 1100 x3 = 450", () => {
      const r = at(1100, 3);
      expect(n(r.baseEarning)).toBe(330);
      expect(n(r.excessEarning)).toBe(120);
      expect(n(r.total)).toBe(450);
    });
  });

  describe("merchant 6% (brand-published)", () => {
    const at = (price, qty = 1) => calcMerchantEarning(price, qty, 6, RULE);

    it("price 1100 — 60 + 40 = 100", () => {
      const r = at(1100);
      expect(n(r.baseEarning)).toBe(60);
      expect(n(r.excessEarning)).toBe(40);
      expect(n(r.total)).toBe(100);
    });

    it("price 999 — 59.94", () => {
      expect(n(at(999).total)).toBe(59.94);
    });

    it("price 5000 — 60 + 1600 = 1660", () => {
      expect(n(at(5000).total)).toBe(1660);
    });
  });

  it("keeps 2-decimal precision on fractional inputs", () => {
    const r = calcMerchantEarning(1234.56, 1, 7.5, RULE);
    expect(n(r.baseEarning)).toBe(75);
    expect(n(r.excessEarning)).toBe(93.82); // 234.56 * 0.40 = 93.824
    expect(n(r.total)).toBe(168.82);
  });

  it("never throws on garbage input", () => {
    expect(() => calcMerchantEarning(null, null, null, null)).not.toThrow();
    expect(n(calcMerchantEarning(undefined, 0, undefined, RULE).total)).toBe(0);
  });
});

describe("buildMerchantPreview", () => {
  it("describes the tier breakdown", () => {
    const p = buildMerchantPreview(1100, 11, RULE);
    expect(p.total).toBe("150.00");
    expect(p.baseEarning).toBe("110.00");
    expect(p.excessEarning).toBe("40.00");
    expect(p.text).toContain("150.00");
    expect(p.text).toContain("1000.00");
  });

  it("omits the tier wording when no rule is active", () => {
    const p = buildMerchantPreview(1100, 11, null);
    expect(p.total).toBe("121.00");
    expect(p.excessEarning).toBe("0.00");
  });
});
