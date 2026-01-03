-- CreateIndex
CREATE INDEX "Product_isActive_visibility_createdAt_idx" ON "Product"("isActive", "visibility", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isActive_visibility_price_idx" ON "Product"("isActive", "visibility", "price");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_mockupId_idx" ON "Product"("mockupId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_fitType_idx" ON "ProductVariant"("fitType");

-- CreateIndex
CREATE INDEX "ProductVariant_color_idx" ON "ProductVariant"("color");

-- CreateIndex
CREATE INDEX "ProductVariant_fitType_color_idx" ON "ProductVariant"("fitType", "color");

-- CreateIndex
CREATE INDEX "Tag_productId_idx" ON "Tag"("productId");

-- CreateIndex
CREATE INDEX "Tag_value_idx" ON "Tag"("value");
