"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function setMerchantCommission(
  _,
  { merchantId, merchantCommissionPct },
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
  // Get the current brandSelectedMerchantPct
    const currentCommissionSetting = await prisma.commissionSetting.findFirst({
      where: { merchantId, brandId: null, productId: null, isActive: true },
    });

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
 // If there is an existing `brandSelectedMerchantPct`, use that value
    const brandSelectedMerchantPct = currentCommissionSetting?.brandSelectedMerchantPct ?? 6.0;

    // Create new active merchant commission
    await prisma.commissionSetting.create({
      data: {
        merchantId,
        merchantCommissionPct,
        brandSelectedMerchantPct,
        isActive: true,
      },
    });
    revalidatePath(`/dashboard/merch/${merchantId}`);

    return { success: true, msg: "Merchant commission updated" };
  } catch (err) {
    console.error("setMerchantCommission error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
export async function updateCommissionWithBrandPctAction(
  _,
  { merchantId, brandSelectedMerchantPct },
) {
  try {
    if (!merchantId || typeof brandSelectedMerchantPct !== "number") {
      return { success: false, msg: "Invalid input" };
    }

    if (brandSelectedMerchantPct < 0 || brandSelectedMerchantPct > 100) {
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

    // Get the current brandSelectedMerchantPct
    const currentCommissionSetting = await prisma.commissionSetting.findFirst({
      where: { merchantId, brandId: null, productId: null, isActive: true },
    });

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

    // If there is an existing `merchantCommissionPct`, use that value
    const merchantCommissionPct = currentCommissionSetting?.merchantCommissionPct ?? 11.0;

    // Create new active merchant commission
    await prisma.commissionSetting.create({
      data: {
        merchantId,
        brandSelectedMerchantPct,
         merchantCommissionPct,
        isActive: true,
      },
    });

    revalidatePath(`/dashboard/merch/${merchantId}`);

    return { success: true, msg: "Merchant With Brand commission updated" };
  } catch (err) {
    console.error("setMerchantCommissionWithBrand error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
