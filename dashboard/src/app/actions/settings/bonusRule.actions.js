"use server";

import { z } from "zod";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/requireRole";
import { invalidateBonusRuleCache } from "@/lib/bonusRule";
import { BONUS_SCENARIOS, validateBonusRule } from "@/lib/bonusSplit";

const PAGE_PATH = "/dashboard/bonus-rules";

const toDec = (v) => new Prisma.Decimal(String(v).trim());

const ruleInput = z.object({
  scenario: z.enum(BONUS_SCENARIOS),
  priceThreshold: z.coerce.number().min(0),
  brandPct: z.coerce.number().min(0).max(100),
  merchantPct: z.coerce.number().min(0).max(100),
  platformPct: z.coerce.number().min(0).max(100),
  note: z.string().max(500).optional().nullable(),
});

function serialize(rule) {
  if (!rule) return null;
  return {
    id: rule.id,
    scenario: rule.scenario,
    priceThreshold: Number(rule.priceThreshold),
    brandPct: Number(rule.brandPct),
    merchantPct: Number(rule.merchantPct),
    platformPct: Number(rule.platformPct),
    isActive: rule.isActive,
    effectiveFrom: rule.effectiveFrom,
    effectiveTo: rule.effectiveTo,
    note: rule.note,
    createdAt: rule.createdAt,
  };
}

function parseAndValidate(payload) {
  const parsed = ruleInput.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, msg: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const check = validateBonusRule(parsed.data);
  if (!check.ok) return { ok: false, msg: check.errors.join("; ") };
  return { ok: true, data: parsed.data };
}

/** All rules, newest first, optionally filtered. */
export async function getBonusRules({ scenario = null, isActive = null } = {}) {
  await requireRole(["ADMIN"]);

  const where = {};
  if (scenario) where.scenario = scenario;
  if (isActive !== null && isActive !== undefined) where.isActive = isActive;

  const rows = await prisma.bonusRule.findMany({
    where,
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(serialize);
}

/** The single active rule per scenario (within its effective window). */
export async function getActiveBonusRulesForAdmin() {
  await requireRole(["ADMIN"]);

  const at = new Date();
  const rows = await prisma.bonusRule.findMany({
    where: {
      isActive: true,
      effectiveFrom: { lte: at },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: at } }],
    },
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });

  const byScenario = {};
  for (const row of rows) {
    if (!byScenario[row.scenario]) byScenario[row.scenario] = serialize(row);
  }
  return byScenario;
}

/**
 * Activate a new version of a scenario's rule: closes the current row (kept for
 * history) and inserts a new one in the same transaction. Never overwrites and
 * never leaves two active rules for a scenario.
 */
export async function createBonusRule(_, payload) {
  const admin = await requireRole(["ADMIN"]);

  const { ok, msg, data } = parseAndValidate(payload);
  if (!ok) return { success: false, msg };

  try {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.bonusRule.updateMany({
        where: { scenario: data.scenario, isActive: true },
        data: { isActive: false, effectiveTo: now },
      });
      await tx.bonusRule.create({
        data: {
          scenario: data.scenario,
          priceThreshold: toDec(data.priceThreshold),
          brandPct: toDec(data.brandPct),
          merchantPct: toDec(data.merchantPct),
          platformPct: toDec(data.platformPct),
          isActive: true,
          effectiveFrom: now,
          createdById: admin.id,
          note: data.note ? String(data.note) : null,
        },
      });
    });

    console.log(
      `[bonus-rule] admin ${admin.id} created ${data.scenario} ${data.brandPct}/${data.merchantPct}/${data.platformPct} @ ${data.priceThreshold}`,
    );

    invalidateBonusRuleCache();
    revalidatePath(PAGE_PATH);
    return { success: true, msg: "Bonus rule saved" };
  } catch (err) {
    console.error("createBonusRule error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}

/** Same versioned behaviour as create — the edited row's scenario is replaced. */
export async function updateBonusRule(_, payload) {
  const admin = await requireRole(["ADMIN"]);

  const id = payload?.id;
  if (!id) return { success: false, msg: "Rule id is required" };

  const existing = await prisma.bonusRule.findUnique({ where: { id } });
  if (!existing) return { success: false, msg: "Rule not found" };

  const { ok, msg, data } = parseAndValidate(payload);
  if (!ok) return { success: false, msg };

  try {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.bonusRule.updateMany({
        where: { scenario: data.scenario, isActive: true },
        data: { isActive: false, effectiveTo: now },
      });
      await tx.bonusRule.create({
        data: {
          scenario: data.scenario,
          priceThreshold: toDec(data.priceThreshold),
          brandPct: toDec(data.brandPct),
          merchantPct: toDec(data.merchantPct),
          platformPct: toDec(data.platformPct),
          isActive: true,
          effectiveFrom: now,
          createdById: admin.id,
          note: data.note ? String(data.note) : null,
        },
      });
    });

    console.log(`[bonus-rule] admin ${admin.id} updated ${data.scenario}`);

    invalidateBonusRuleCache();
    revalidatePath(PAGE_PATH);
    return { success: true, msg: "Bonus rule updated" };
  } catch (err) {
    console.error("updateBonusRule error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}

/** Turn a rule off (kept for history) without deleting it. */
export async function deactivateBonusRule(_, { id } = {}) {
  const admin = await requireRole(["ADMIN"]);
  if (!id) return { success: false, msg: "Rule id is required" };

  try {
    const now = new Date();
    await prisma.bonusRule.update({
      where: { id },
      data: { isActive: false, effectiveTo: now },
    });

    invalidateBonusRuleCache();
    revalidatePath(PAGE_PATH);
    return { success: true, msg: "Bonus rule deactivated" };
  } catch (err) {
    console.error("deactivateBonusRule error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
