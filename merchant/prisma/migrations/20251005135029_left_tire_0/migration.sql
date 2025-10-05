/*
  Warnings:

  - Made the column `leftTiar` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MerchantProfile" ALTER COLUMN "leftTiar" SET NOT NULL,
ALTER COLUMN "leftTiar" SET DEFAULT 0;
