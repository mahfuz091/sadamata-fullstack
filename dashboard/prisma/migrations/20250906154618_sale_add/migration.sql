/*
  Warnings:

  - You are about to drop the column `BrandId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `BrandName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `MockupId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `designBack` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `designFront` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `feature` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Product` table. All the data in the column will be lost.
  - Added the required column `mockupId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('SEARCHABLE', 'NON_SEARCHABLE');

-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('FRONT', 'BACK');

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_BrandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_MockupId_fkey";

-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "defaultBrandPct" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
ADD COLUMN     "defaultMerchantPct" DOUBLE PRECISION NOT NULL DEFAULT 10.0;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "BrandId",
DROP COLUMN "BrandName",
DROP COLUMN "MockupId",
DROP COLUMN "designBack",
DROP COLUMN "designFront",
DROP COLUMN "feature",
DROP COLUMN "tags",
ADD COLUMN     "brandCommissionPct" DOUBLE PRECISION,
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "merchantCommissionPct" DOUBLE PRECISION,
ADD COLUMN     "mockupId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'SEARCHABLE';

-- CreateTable
CREATE TABLE "public"."Sale" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "brandId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total" DOUBLE PRECISION NOT NULL,
    "brandEarning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "merchantEarning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "platformEarning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "fitType" "public"."FitType" NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "type" "public"."ImageType" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_mockupId_fkey" FOREIGN KEY ("mockupId") REFERENCES "public"."Mockup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feature" ADD CONSTRAINT "Feature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
