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

    // 🔹 Find brand by userId
    const brand = await prisma.brand.findUnique({
      where: { userId: brandId },
      select: { id: true },
    });

    if (!brand) {
      return { success: false, msg: "Brand not found" };
    }

    // 🔹 Deactivate old
    await prisma.commissionSetting.updateMany({
      where: {
        brandId: brand.id,
        merchantId: null,
        productId: null,
        isActive: true,
      },
      data: {
        isActive: false,
        effectiveTo: new Date(),
      },
    });

    // 🔹 Create new
    await prisma.commissionSetting.create({
      data: {
        brandId: brand.id, // ✅ FIXED
        brandCommissionPct,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/brands");

    return { success: true };
  } catch (err) {
    console.error("setBrandCommission error:", err);
    return { success: false, msg: "Something went wrong" };
  }
}
