import { describe, it, expect } from "vitest";
import { prorateExcessRefund } from "@/lib/bonusSplit";

const n = (d) => Number(Number(d).toFixed(2));

const SALE = { brandExcess: 300, merchantExcess: 100, platformExcess: 100 }; // soldQty 3

describe("prorateExcessRefund", () => {
  it("full refund reverses everything", () => {
    const r = prorateExcessRefund({ soldQty: 3, refundQty: 3, ...SALE });
    expect(n(r.brandExcessReversed)).toBe(300);
    expect(n(r.merchantExcessReversed)).toBe(100);
    expect(n(r.platformExcessReversed)).toBe(100);
  });

  it("partial refund reverses proportionally", () => {
    const r = prorateExcessRefund({ soldQty: 3, refundQty: 1, ...SALE });
    expect(n(r.brandExcessReversed)).toBe(100);
    expect(n(r.merchantExcessReversed)).toBe(33.33);
    expect(n(r.platformExcessReversed)).toBe(33.33);
  });

  it("clamps a refund larger than the sold quantity", () => {
    const r = prorateExcessRefund({ soldQty: 3, refundQty: 99, ...SALE });
    expect(n(r.brandExcessReversed)).toBe(300);
    expect(n(r.merchantExcessReversed)).toBe(100);
  });

  it("never reverses from a zero-quantity sale", () => {
    const r = prorateExcessRefund({ soldQty: 0, refundQty: 1, ...SALE });
    expect(n(r.brandExcessReversed)).toBe(0);
    expect(n(r.merchantExcessReversed)).toBe(0);
    expect(n(r.platformExcessReversed)).toBe(0);
  });

  it("handles missing snapshot values as zero", () => {
    expect(() => prorateExcessRefund({})).not.toThrow();
    const r = prorateExcessRefund({ soldQty: 2, refundQty: 1 });
    expect(n(r.brandExcessReversed)).toBe(0);
  });
});
