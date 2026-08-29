// Email validator
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Bangladeshi phone normalizer.
// Accepts 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX, 008801XXXXXXXXX and the
// bare 1XXXXXXXXX, with spaces / dashes / dots / parens anywhere.
// Returns the canonical local form 01XXXXXXXXX, or null when it is not a BD number.
export function normalizeBDPhone(phone) {
  let s = String(phone ?? "").replace(/[\s\-().]/g, "");
  if (!s) return null;

  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("00")) s = s.slice(2);
  if (s.startsWith("880")) s = "0" + s.slice(3);
  if (/^1[3-9]\d{8}$/.test(s)) s = "0" + s;

  return /^01[3-9]\d{8}$/.test(s) ? s : null;
}

// Bangladeshi phone validator
export function isValidBDPhone(phone) {
  return normalizeBDPhone(phone) !== null;
}
