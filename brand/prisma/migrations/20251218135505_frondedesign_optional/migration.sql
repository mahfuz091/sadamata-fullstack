-- AlterTable
ALTER TABLE "MockupVariant" ALTER COLUMN "frontImg" DROP NOT NULL,
ALTER COLUMN "backImg" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "frontDesign" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "frontImg" DROP NOT NULL;
