-- CreateEnum
CREATE TYPE "public"."PayoutActor" AS ENUM ('BRAND', 'MERCHANT');

-- CreateTable
CREATE TABLE "public"."Payout" (
    "id" TEXT NOT NULL,
    "actor" "public"."PayoutActor" NOT NULL,
    "brandId" TEXT,
    "merchantId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payout_actor_brandId_merchantId_createdAt_idx" ON "public"."Payout"("actor", "brandId", "merchantId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
