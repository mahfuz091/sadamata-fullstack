-- AlterTable
ALTER TABLE "MockupVariant" ADD COLUMN     "isVisible" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE INDEX "MockupVariant_mockupId_isVisible_idx" ON "MockupVariant"("mockupId", "isVisible");
