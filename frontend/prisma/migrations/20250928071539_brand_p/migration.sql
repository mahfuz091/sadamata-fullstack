/*
  Warnings:

  - Added the required column `accountName` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankBranch` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industryType` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nidOrPassportNo` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanentAddress` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentAddress` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routingNumber` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialProfile` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "accountName" VARCHAR(120) NOT NULL,
ADD COLUMN     "accountNumber" VARCHAR(64) NOT NULL,
ADD COLUMN     "bankBranch" VARCHAR(80) NOT NULL,
ADD COLUMN     "bankName" VARCHAR(80) NOT NULL,
ADD COLUMN     "contactEmail" VARCHAR(190) NOT NULL,
ADD COLUMN     "contactPhone" VARCHAR(32) NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(120) NOT NULL,
ADD COLUMN     "industryType" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "nidOrPassportNo" VARCHAR(64) NOT NULL,
ADD COLUMN     "permanentAddress" VARCHAR(255) NOT NULL,
ADD COLUMN     "portfolioUrl" VARCHAR(255),
ADD COLUMN     "presentAddress" VARCHAR(255) NOT NULL,
ADD COLUMN     "routingNumber" VARCHAR(64) NOT NULL,
ADD COLUMN     "socialProfile" TEXT NOT NULL,
ADD COLUMN     "websiteUrl" VARCHAR(255);
