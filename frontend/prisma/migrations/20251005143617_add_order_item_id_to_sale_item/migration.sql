/*
  Warnings:

  - A unique constraint covering the columns `[orderItemId]` on the table `SaleItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderItemId` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `SaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SaleItem" ADD COLUMN     "orderItemId" TEXT NOT NULL,
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SaleItem_orderItemId_key" ON "public"."SaleItem"("orderItemId");
