"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function setBrandCommission(_, { brandId, brandCommissionPct }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, msg: "Unauthorized" };
    }

    const pct = Number(brandCommissionPct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return { success: false, msg: "Commission must be between 0 and 100" };
    }

    // 🔹 Find brand by userId
    const brand = await prisma.brand.findUnique({
      where: { userId: brandId },
      select: { id: true, defaultMerchantPct: true },
    });

    if (!brand) {
      return { success: false, msg: "Brand not found" };
    }

    const currentRule = await prisma.commissionSetting.findFirst({
      where: {
        brandId: brand.id,
        merchantId: null,
        productId: null,
        isActive: true,
      },
      orderBy: { effectiveFrom: "desc" },
      select: { merchantCommissionPct: true },
    });

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // 🔹 Deactivate old
      await tx.commissionSetting.updateMany({
        where: {
          brandId: brand.id,
          merchantId: null,
          productId: null,
          isActive: true,
        },
        data: {
          isActive: false,
          effectiveTo: now,
        },
      });

      // 🔹 Create new — carry the brand's merchant share forward instead of
      // letting it fall back to the schema default (11.0).
      await tx.commissionSetting.create({
        data: {
          brandId: brand.id,
          merchantId: null,
          productId: null,
          brandCommissionPct: pct,
          merchantCommissionPct:
            currentRule?.merchantCommissionPct ?? brand.defaultMerchantPct ?? 6,
          effectiveFrom: now,
          isActive: true,
        },
      });

      // 🔹 Keep Brand.defaultBrandPct in sync — it is the fallback used by the
      // product-create resolver and by every recomputing sales report.
      await tx.brand.update({
        where: { id: brand.id },
        data: { defaultBrandPct: pct },
      });
    });

    revalidatePath("/dashboard/brands");

    return { success: true };
  } catch (err) {
    console.error("setBrandCommission error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
