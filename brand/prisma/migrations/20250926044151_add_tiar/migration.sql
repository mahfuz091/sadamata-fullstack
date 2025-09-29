/*
  Warnings:

  - Made the column `dateOfBirth` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactEmail` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPhone` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nidOrPassportNo` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentAddress` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permanentAddress` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankName` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankBranch` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountName` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountNumber` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `routingNumber` on table `MerchantProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MerchantProfile" ADD COLUMN     "tiar" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "contactEmail" SET NOT NULL,
ALTER COLUMN "contactPhone" SET NOT NULL,
ALTER COLUMN "nidOrPassportNo" SET NOT NULL,
ALTER COLUMN "presentAddress" SET NOT NULL,
ALTER COLUMN "permanentAddress" SET NOT NULL,
ALTER COLUMN "bankName" SET NOT NULL,
ALTER COLUMN "bankBranch" SET NOT NULL,
ALTER COLUMN "accountName" SET NOT NULL,
ALTER COLUMN "accountNumber" SET NOT NULL,
ALTER COLUMN "routingNumber" SET NOT NULL;
