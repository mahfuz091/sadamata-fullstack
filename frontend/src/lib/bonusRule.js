import prisma from "@/lib/prisma";
import { resolveBonusScenario } from "@/lib/bonusSplit";

const TTL_MS = 45_000;

// In-process cache. Separate Next.js processes (frontend/merchant/dashboard)
// cannot share this, so cross-app edits take up to TTL_MS to be seen; the
// dashboard invalidates its own copy immediately after an admin update.
let cache = { at: 0, rules: undefined };

/**
 * Active bonus rules keyed by scenario (Map<scenario, rule>). At most one rule
 * per scenario is active; the newest wins if the DB somehow holds extras.
 * Cached for TTL_MS unless `force` is set.
 */
export async function getActiveBonusRules({ force = false } = {}) {
  const now = Date.now();
  if (!force && cache.rules !== undefined && now - cache.at < TTL_MS) {
    return cache.rules;
  }

  // Guard against a not-yet-generated client during rollout.
  if (!prisma.bonusRule) {
    cache = { at: now, rules: new Map() };
    return cache.rules;
  }

  let rows = [];
  try {
    const at = new Date();
    rows = await prisma.bonusRule.findMany({
      where: {
        isActive: true,
        effectiveFrom: { lte: at },
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: at } }],
      },
      orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn(
      "[bonus] active rule lookup failed; treating as none:",
      err?.message,
    );
    cache = { at: now, rules: new Map() };
    return cache.rules;
  }

  const rules = new Map();
  for (const row of rows) {
    if (!rules.has(row.scenario)) rules.set(row.scenario, row);
  }

  cache = { at: now, rules };
  return rules;
}

/** The active rule for a product/brand pair, or null. */
export async function getScenarioBonusRule({
  brandId,
  brandIsExclusive,
  force = false,
} = {}) {
  const rules = await getActiveBonusRules({ force });
  const scenario = resolveBonusScenario({ brandId, brandIsExclusive });
  return rules.get(scenario) ?? null;
}

export function invalidateBonusRuleCache() {
  cache = { at: 0, rules: undefined };
}
