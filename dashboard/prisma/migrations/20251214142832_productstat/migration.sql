-- CreateEnum
CREATE TYPE "ProductStat" AS ENUM ('UNDERREVIEW', 'PROCESSING', 'ACTIVE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStat";
