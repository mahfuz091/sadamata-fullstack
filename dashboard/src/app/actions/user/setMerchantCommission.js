"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function setMerchantCommission(
  _,
  { merchantId, merchantCommissionPct }
) {
  try {
    if (!merchantId || typeof merchantCommissionPct !== "number") {
      return { success: false, msg: "Invalid input" };
    }

    if (merchantCommissionPct < 0 || merchantCommissionPct > 100) {
      return { success: false, msg: "Commission must be between 0 and 100" };
    }

    // Admin guard
    const session = await auth();
    if (
      !session?.user ||
      !["ADMIN", "SUPERADMIN"].includes(session.user.role)
    ) {
      return { success: false, msg: "Unauthorized" };
    }

    // Deactivate previous merchant-level commissions
    await prisma.commissionSetting.updateMany({
      where: {
        merchantId,
        brandId: null,
        productId: null,
        isActive: true,
      },
      data: {
        isActive: false,
        effectiveTo: new Date(),
      },
    });

    // Create new active merchant commission
    await prisma.commissionSetting.create({
      data: {
        merchantId,
        merchantCommissionPct,
        isActive: true,
      },
    });

    return { success: true, msg: "Merchant commission updated" };
  } catch (err) {
    console.error("setMerchantCommission error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
