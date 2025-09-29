/*
  Warnings:

  - The `visibility` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "visibility",
ADD COLUMN     "visibility" BOOLEAN NOT NULL DEFAULT true;
