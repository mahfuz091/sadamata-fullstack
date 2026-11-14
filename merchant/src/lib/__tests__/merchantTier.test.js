import { describe, it, expect } from "vitest";
import { calcMerchantEarning, buildMerchantPreview } from "@/lib/merchantTier";

// BonusRule rows resolved for a scenario — merchantPct is the excess share.
const RULE40 = { priceThreshold: 1000, merchantPct: 40, isActive: true }; // NO_BRAND
const RULE30 = { priceThreshold: 1000, merchantPct: 30, isActive: true }; // NON_EXCLUSIVE_BRAND
const RULE20 = { priceThreshold: 1000, merchantPct: 20, isActive: true }; // EXCLUSIVE_BRAND
const INACTIVE = { priceThreshold: 1000, merchantPct: 40, isActive: false };

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

  describe("merchant 11% under the NO_BRAND rule (40% excess)", () => {
    const at = (price, qty = 1) => calcMerchantEarning(price, qty, 11, RULE40);

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
    const at = (price, qty = 1) => calcMerchantEarning(price, qty, 6, RULE40);

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

  describe("the scenario rule drives the merchant's excess share", () => {
    it("exclusive brand — merchant gets 20% of the excess", () => {
      const r = calcMerchantEarning(1500, 1, 20, RULE20);
      expect(n(r.baseEarning)).toBe(200); // 1000 × 20%
      expect(n(r.excessEarning)).toBe(100); // 500 × 20%
      expect(n(r.total)).toBe(300);
    });

    it("non-exclusive brand — merchant gets 30% of the excess", () => {
      const r = calcMerchantEarning(1500, 1, 30, RULE30);
      expect(n(r.baseEarning)).toBe(300); // 1000 × 30%
      expect(n(r.excessEarning)).toBe(150); // 500 × 30%
      expect(n(r.total)).toBe(450);
    });

    it("quantity scales both slices", () => {
      const r = calcMerchantEarning(1500, 2, 20, RULE20);
      expect(n(r.baseEarning)).toBe(400);
      expect(n(r.excessEarning)).toBe(200);
      expect(n(r.total)).toBe(600);
    });
  });

  it("keeps 2-decimal precision on fractional inputs", () => {
    const r = calcMerchantEarning(1234.56, 1, 7.5, RULE40);
    expect(n(r.baseEarning)).toBe(75);
    expect(n(r.excessEarning)).toBe(93.82); // 234.56 * 0.40 = 93.824
    expect(n(r.total)).toBe(168.82);
  });

  it("never throws on garbage input", () => {
    expect(() => calcMerchantEarning(null, null, null, null)).not.toThrow();
    expect(n(calcMerchantEarning(undefined, 0, undefined, RULE40).total)).toBe(0);
  });
});

describe("buildMerchantPreview", () => {
  it("shows only the total earning, without the tier breakdown", () => {
    const p = buildMerchantPreview(1100, 11, RULE40);
    expect(p.total).toBe("150.00");
    expect(p.baseEarning).toBe("110.00");
    expect(p.excessEarning).toBe("40.00");
    expect(p.text).toBe("At this price you earn 150.00 BDT per sale");
  });

  it("omits the tier wording when no rule is active", () => {
    const p = buildMerchantPreview(1100, 11, null);
    expect(p.total).toBe("121.00");
    expect(p.excessEarning).toBe("0.00");
    expect(p.text).toBe("At this price you earn 121.00 BDT per sale");
  });

  it("shows only the total for an exclusive-brand rule", () => {
    const p = buildMerchantPreview(1500, 20, RULE20);
    expect(p.total).toBe("300.00");
    expect(p.baseEarning).toBe("200.00");
    expect(p.excessEarning).toBe("100.00");
    expect(p.excessPct).toBe("20.00");
    expect(p.text).toBe("At this price you earn 300.00 BDT per sale");
  });
});
