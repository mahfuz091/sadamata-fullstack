/*
  Warnings:

  - A unique constraint covering the columns `[mockupId,color,fitType]` on the table `MockupVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fitType` to the `MockupVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FitType" AS ENUM ('MEN', 'WOMEN', 'YOUTH');

-- DropIndex
DROP INDEX "public"."MockupVariant_mockupId_color_key";

-- AlterTable
ALTER TABLE "public"."MockupVariant" ADD COLUMN     "fitType" "public"."FitType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MockupVariant_mockupId_color_fitType_key" ON "public"."MockupVariant"("mockupId", "color", "fitType");
