import { prisma } from "../prisma";

export async function resolveCommission({ productId, brandId, merchantId }) {
  // 1️⃣ Product-level override
  const productCommission = await prisma.commissionSetting.findFirst({
    where: {
      productId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (productCommission) {
    return {
      brandPct: productCommission.brandCommissionPct,
      merchantPct: productCommission.merchantCommissionPct,
    };
  }

  // 2️⃣ Brand-level override
  if (brandId) {
    const brandCommission = await prisma.commissionSetting.findFirst({
      where: {
        brandId,
        isActive: true,
        productId: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (brandCommission) {
      return {
        brandPct: brandCommission.brandCommissionPct,
        merchantPct: brandCommission.merchantCommissionPct,
      };
    }
  }

  // 3️⃣ Merchant-level override
  const merchantCommission = await prisma.commissionSetting.findFirst({
    where: {
      merchantId,
      isActive: true,
      productId: null,
      brandId: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (merchantCommission) {
    return {
      brandPct: merchantCommission.brandCommissionPct,
      merchantPct: merchantCommission.merchantCommissionPct,
    };
  }

  // 4️⃣ Brand default
  if (brandId) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        defaultBrandPct: true,
        defaultMerchantPct: true,
      },
    });

    if (brand) {
      return {
        brandPct: brand.defaultBrandPct,
        merchantPct: brand.defaultMerchantPct,
      };
    }
  }

  // 5️⃣ Platform fallback
  return {
    brandPct: 10,
    merchantPct: 10,
  };
}
