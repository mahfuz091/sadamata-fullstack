/*
  Warnings:

  - You are about to drop the `_BrandToBrandCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brandCategoryId` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_BrandToBrandCategory" DROP CONSTRAINT "_BrandToBrandCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BrandToBrandCategory" DROP CONSTRAINT "_BrandToBrandCategory_B_fkey";

-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "brandCategoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_BrandToBrandCategory";

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_brandCategoryId_fkey" FOREIGN KEY ("brandCategoryId") REFERENCES "public"."BrandCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
