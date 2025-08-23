/*
  Warnings:

  - The primary key for the `Brand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BrandCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubBrand` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Brand" DROP CONSTRAINT "Brand_brandCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubBrand" DROP CONSTRAINT "SubBrand_brandId_fkey";

-- AlterTable
ALTER TABLE "public"."Brand" DROP CONSTRAINT "Brand_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "brandCategoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Brand_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Brand_id_seq";

-- AlterTable
ALTER TABLE "public"."BrandCategory" DROP CONSTRAINT "BrandCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BrandCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BrandCategory_id_seq";

-- AlterTable
ALTER TABLE "public"."SubBrand" DROP CONSTRAINT "SubBrand_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "brandId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubBrand_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SubBrand_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_brandCategoryId_fkey" FOREIGN KEY ("brandCategoryId") REFERENCES "public"."BrandCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubBrand" ADD CONSTRAINT "SubBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
