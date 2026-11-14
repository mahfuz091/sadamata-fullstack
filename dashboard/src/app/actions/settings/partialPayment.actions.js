"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/requireRole";
import { invalidatePartialPaymentRuleCache } from "@/lib/partialPaymentRule";

const PAGE_PATH = "/dashboard/partial-payment";

const toDec = (v) => new Prisma.Decimal(String(v).trim());

const isNumeric = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && Number.isFinite(Number(s));
};

function serialize(rule) {
  if (!rule) return null;
  return {
    id: rule.id,
    percent: Number(rule.percent),
    isEnabled: rule.isEnabled,
    isActive: rule.isActive,
    effectiveFrom: rule.effectiveFrom,
    effectiveTo: rule.effectiveTo,
    createdById: rule.createdById,
    note: rule.note,
    createdAt: rule.createdAt,
  };
}

/** Current active rule (null when none configured yet). */
export async function getPartialPaymentRule() {
  await requireRole(["ADMIN"]);
  const rule = await prisma.partialPaymentRule.findFirst({
    where: { isActive: true },
    orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
  return serialize(rule);
}

/** All rules, newest first, paginated. */
export async function getPartialPaymentRuleHistory({ page = 1, pageSize = 10 } = {}) {
  await requireRole(["ADMIN"]);

  const take = Math.min(Math.max(Number(pageSize) || 10, 1), 100);
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * take;

  const [rows, count] = await Promise.all([
    prisma.partialPaymentRule.findMany({
      orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.partialPaymentRule.count(),
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
 * future orders only.
 */
export async function updatePartialPaymentRule(
  _,
  { percent, isEnabled = true, note } = {},
) {
  const admin = await requireRole(["ADMIN"]);

  try {
    if (!isNumeric(percent)) {
      return { success: false, msg: "Percentage must be a number" };
    }

    const pct = toDec(percent);

    if (pct.lte(0) || pct.gte(100)) {
      return { success: false, msg: "Percentage must be between 0 and 100 (exclusive)" };
    }

    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.partialPaymentRule.updateMany({
        where: { isActive: true },
        data: { isActive: false, effectiveTo: now },
      });
      await tx.partialPaymentRule.create({
        data: {
          percent: pct,
          isEnabled: Boolean(isEnabled),
          isActive: true,
          effectiveFrom: now,
          createdById: admin.id,
          note: note ? String(note) : null,
        },
      });
    });

    console.log(
      `[partial-payment] admin ${admin.id} set percent=${pct} enabled=${Boolean(isEnabled)}`,
    );

    invalidatePartialPaymentRuleCache();
    revalidatePath(PAGE_PATH);

    return { success: true, msg: "Partial payment settings updated" };
  } catch (err) {
    console.error("updatePartialPaymentRule error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
