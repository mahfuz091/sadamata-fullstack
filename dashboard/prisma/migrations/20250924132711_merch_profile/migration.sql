-- CreateTable
CREATE TABLE "public"."MerchantProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "contactEmail" VARCHAR(190),
    "contactPhone" VARCHAR(32),
    "nidOrPassportNo" VARCHAR(64),
    "presentAddress" VARCHAR(255),
    "permanentAddress" VARCHAR(255),
    "portfolioUrl" VARCHAR(255),
    "websiteUrl" VARCHAR(255),
    "bankName" VARCHAR(80),
    "bankBranch" VARCHAR(80),
    "accountName" VARCHAR(120),
    "accountNumber" VARCHAR(64),
    "routingNumber" VARCHAR(64),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantProfile_userId_key" ON "public"."MerchantProfile"("userId");

-- CreateIndex
CREATE INDEX "MerchantProfile_bankName_bankBranch_idx" ON "public"."MerchantProfile"("bankName", "bankBranch");

-- AddForeignKey
ALTER TABLE "public"."MerchantProfile" ADD CONSTRAINT "MerchantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
