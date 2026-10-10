import { prisma } from "@/lib/prisma";

const TTL_MS = 45_000;

// In-process cache. Separate Next.js processes (frontend/merchant/dashboard)
// cannot share this, so cross-app edits take up to TTL_MS to be seen; the
// dashboard invalidates its own copy immediately after an admin update.
let cache = { at: 0, rule: undefined };

export async function getActiveBonusRule({ force = false } = {}) {
  const now = Date.now();
  if (!force && cache.rule !== undefined && now - cache.at < TTL_MS) {
    return cache.rule;
  }

  // Guard against a not-yet-generated client during rollout.
  if (!prisma.merchantBonusRule) {
    cache = { at: now, rule: null };
    return null;
  }

  let rule = null;
  try {
    rule = await prisma.merchantBonusRule.findFirst({
      where: { isActive: true },
      orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn(
      "[commission] active bonus rule lookup failed; treating as none:",
      err?.message,
    );
    cache = { at: now, rule: null };
    return null;
  }

  cache = { at: now, rule };
  return rule;
}

export function invalidateBonusRuleCache() {
  cache = { at: 0, rule: undefined };
}
