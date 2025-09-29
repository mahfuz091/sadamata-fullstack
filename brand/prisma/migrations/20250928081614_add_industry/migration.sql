/*
  Warnings:

  - Added the required column `industryType` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "industryType" TEXT NOT NULL;
