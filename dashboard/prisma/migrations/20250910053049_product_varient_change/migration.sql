/*
  Warnings:

  - You are about to alter the column `color` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(24)`.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[color,fitType]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `backImg` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frontImg` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_variantId_fkey";

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "backImg" TEXT NOT NULL,
ADD COLUMN     "frontImg" TEXT NOT NULL,
ALTER COLUMN "color" SET DATA TYPE VARCHAR(24);

-- DropTable
DROP TABLE "public"."ProductImage";

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_color_fitType_key" ON "public"."ProductVariant"("color", "fitType");
