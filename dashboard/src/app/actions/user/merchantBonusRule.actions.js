"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/requireRole";
import { invalidateBonusRuleCache } from "@/lib/merchantTierRule";

const PAGE_PATH = "/dashboard/merchant-tier-commission";

const toDec = (v) => new Prisma.Decimal(String(v).trim());

const isNumeric = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && Number.isFinite(Number(s));
};

function serialize(rule) {
  if (!rule) return null;
  return {
    id: rule.id,
    priceThreshold: Number(rule.priceThreshold),
    excessPct: Number(rule.excessPct),
    isActive: rule.isActive,
    effectiveFrom: rule.effectiveFrom,
    effectiveTo: rule.effectiveTo,
    createdById: rule.createdById,
    note: rule.note,
    createdAt: rule.createdAt,
  };
}

/** Current active rule (null when disabled). */
export async function getMerchantBonusRule() {
  await requireRole(["ADMIN"]);
  const rule = await prisma.merchantBonusRule.findFirst({
    where: { isActive: true },
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
  return serialize(rule);
}

/** All rules, newest first, paginated. */
export async function getMerchantBonusRuleHistory({ page = 1, pageSize = 10 } = {}) {
  await requireRole(["ADMIN"]);

  const take = Math.min(Math.max(Number(pageSize) || 10, 1), 100);
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * take;

  const [rows, count] = await Promise.all([
    prisma.merchantBonusRule.findMany({
      orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.merchantBonusRule.count(),
  ]);

  const ids = [...new Set(rows.map((r) => r.createdById).filter(Boolean))];
  const users = ids.length
    ? await prisma.user.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const nameById = new Map(users.map((u) => [u.id, u.name || u.email]));

  return {
    items: rows.map((r) => ({
      ...serialize(r),
      createdByName: r.createdById ? nameById.get(r.createdById) ?? r.createdById : "—",
    })),
    count,
    page: currentPage,
    pageSize: take,
    totalPages: Math.max(1, Math.ceil(count / take)),
  };
}

/**
 * Replace the active rule: closes the current row (kept for history) and
 * inserts a new one inside a single transaction. Never overwrites. Applies to
 * future sales only.
 */
export async function updateMerchantBonusRule(
  _,
  { priceThreshold, excessPct, isActive = true, note } = {},
) {
  const admin = await requireRole(["ADMIN"]);

  try {
    if (!isNumeric(priceThreshold)) {
      return { success: false, msg: "Price threshold must be a number" };
    }
    if (!isNumeric(excessPct)) {
      return { success: false, msg: "Excess % must be a number" };
    }

    const threshold = toDec(priceThreshold);
    const excess = toDec(excessPct);

    if (threshold.lte(0)) {
      return { success: false, msg: "Price threshold must be greater than 0" };
    }
    if (excess.lt(0) || excess.gt(100)) {
      return { success: false, msg: "Excess % must be between 0 and 100" };
    }

    // Safety guard: brand commission on the excess portion must not push the
    // platform share negative.
    const [brandMax, settingMax] = await Promise.all([
      prisma.brand.aggregate({ _max: { defaultBrandPct: true } }),
      prisma.commissionSetting.aggregate({
        where: { isActive: true, brandId: { not: null } },
        _max: { brandCommissionPct: true },
      }),
    ]);
    const maxBrandPct = new Prisma.Decimal(
      String(
        Math.max(
          Number(brandMax._max.defaultBrandPct ?? 0),
          Number(settingMax._max.brandCommissionPct ?? 0),
        ),
      ),
    );
    if (excess.add(maxBrandPct).gt(100)) {
      return {
        success: false,
        msg: `Excess ${excess}% + highest brand commission ${maxBrandPct}% would exceed 100%. Lower the excess rate.`,
      };
    }

    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.merchantBonusRule.updateMany({
        where: { isActive: true },
        data: { isActive: false, effectiveTo: now },
      });
      await tx.merchantBonusRule.create({
        data: {
          priceThreshold: threshold,
          excessPct: excess,
          isActive: Boolean(isActive),
          effectiveFrom: now,
          createdById: admin.id,
          note: note ? String(note) : null,
        },
      });
    });

    console.log(
      `[bonus-rule] admin ${admin.id} set threshold=${threshold} excess=${excess}% active=${Boolean(isActive)}`,
    );

    invalidateBonusRuleCache();
    revalidatePath(PAGE_PATH);

    return { success: true, msg: "Merchant tier commission updated" };
  } catch (err) {
    console.error("updateMerchantBonusRule error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
