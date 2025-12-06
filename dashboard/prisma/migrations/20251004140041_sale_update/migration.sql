/*
  Warnings:

  - A unique constraint covering the columns `[orderItemId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderItemId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."Sale" ADD COLUMN     "orderItemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_orderItemId_key" ON "public"."Sale"("orderItemId");

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
