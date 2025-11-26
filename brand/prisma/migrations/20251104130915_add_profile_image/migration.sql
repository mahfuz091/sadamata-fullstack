/*
  Warnings:

  - You are about to drop the `Refund` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Refund" DROP CONSTRAINT "Refund_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Refund" DROP CONSTRAINT "Refund_saleId_fkey";

-- AlterTable
ALTER TABLE "public"."UserAddress" ADD COLUMN     "profileImage" TEXT;

-- DropTable
DROP TABLE "public"."Refund";
