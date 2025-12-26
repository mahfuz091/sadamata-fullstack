-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_mockupId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "mockupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mockupId_fkey" FOREIGN KEY ("mockupId") REFERENCES "Mockup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
