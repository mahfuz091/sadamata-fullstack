/*
  Warnings:

  - You are about to drop the `SubBrand` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SubBrand" DROP CONSTRAINT "SubBrand_brandId_fkey";

-- DropTable
DROP TABLE "public"."SubBrand";

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "designFront" TEXT[],
    "designBack" TEXT[],
    "feature" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "BrandName" TEXT,
    "BrandId" TEXT,
    "MockupId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mockup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mockup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MockupVariant" (
    "id" TEXT NOT NULL,
    "mockupId" TEXT NOT NULL,
    "color" VARCHAR(24) NOT NULL,
    "frontImg" TEXT NOT NULL,
    "backImg" TEXT,

    CONSTRAINT "MockupVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockupVariant_mockupId_color_key" ON "public"."MockupVariant"("mockupId", "color");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_BrandId_fkey" FOREIGN KEY ("BrandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_MockupId_fkey" FOREIGN KEY ("MockupId") REFERENCES "public"."Mockup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MockupVariant" ADD CONSTRAINT "MockupVariant_mockupId_fkey" FOREIGN KEY ("mockupId") REFERENCES "public"."Mockup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
