// Partial (advance) payment math, shared by checkout and the payment callbacks.

export function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

// The configured percentage is only usable when the feature is enabled and the
// value is a strictly-in-between percentage (100% is just a full payment).
export function resolvePartialPercent(rule) {
  if (!rule || rule.isEnabled === false) return null;
  const pct = Number(rule.percent);
  if (!Number.isFinite(pct) || pct <= 0 || pct >= 100) return null;
  return pct;
}

// Amount to charge now + the remainder, from the full total and the resolved
// option/percent. A FULL order (or missing percent) always charges the total.
export function splitAmount(grandTotal, option, percent) {
  const grand = round2(grandTotal);
  if (option === "PARTIAL" && percent) {
    const payableNow = round2((grand * Number(percent)) / 100);
    return { payableNow, dueNow: round2(grand - payableNow) };
  }
  return { payableNow: grand, dueNow: 0 };
}

// What was actually collected for an order is always the total minus whatever
// is still recorded as due.
export function paidFromOrder(order) {
  return round2(Number(order?.grandTotal || 0) - Number(order?.dueAmount || 0));
}
