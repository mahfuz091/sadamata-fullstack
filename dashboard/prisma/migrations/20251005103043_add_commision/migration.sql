-- CreateTable
CREATE TABLE "public"."CommissionSetting" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "merchantId" TEXT,
    "brandCommissionPct" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "merchantCommissionPct" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "productId" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommissionSetting_brandId_merchantId_productId_idx" ON "public"."CommissionSetting"("brandId", "merchantId", "productId");

-- AddForeignKey
ALTER TABLE "public"."CommissionSetting" ADD CONSTRAINT "CommissionSetting_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommissionSetting" ADD CONSTRAINT "CommissionSetting_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommissionSetting" ADD CONSTRAINT "CommissionSetting_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
