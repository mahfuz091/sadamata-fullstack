/*
  Warnings:

  - You are about to drop the column `brandId` on the `BrandCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BrandCategory" DROP CONSTRAINT "BrandCategory_brandId_fkey";

-- AlterTable
ALTER TABLE "public"."BrandCategory" DROP COLUMN "brandId";

-- CreateTable
CREATE TABLE "public"."_BrandToBrandCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BrandToBrandCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BrandToBrandCategory_B_index" ON "public"."_BrandToBrandCategory"("B");

-- AddForeignKey
ALTER TABLE "public"."_BrandToBrandCategory" ADD CONSTRAINT "_BrandToBrandCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BrandToBrandCategory" ADD CONSTRAINT "_BrandToBrandCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."BrandCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
