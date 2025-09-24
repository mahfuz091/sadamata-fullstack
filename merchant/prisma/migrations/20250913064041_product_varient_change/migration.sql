/*
  Warnings:

  - A unique constraint covering the columns `[productId,color,fitType]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ProductVariant_color_fitType_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_color_fitType_key" ON "public"."ProductVariant"("productId", "color", "fitType");
