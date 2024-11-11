-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "size" TEXT[],
    "price" DECIMAL(65,30) NOT NULL,
    "gender" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_sold" INTEGER NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "discount" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInventory" (
    "id" SERIAL NOT NULL,
    "minStock" INTEGER NOT NULL,
    "stock" BOOLEAN NOT NULL,
    "productsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "comments" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "productsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "discount" INTEGER NOT NULL,
    "espiryDate" TIMESTAMP(3) NOT NULL,
    "isGlobal" BOOLEAN NOT NULL,
    "isNew" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Products_categoryId_idx" ON "Products"("categoryId");

-- CreateIndex
CREATE INDEX "Products_price_idx" ON "Products"("price");

-- CreateIndex
CREATE INDEX "Products_product_idx" ON "Products"("product");

-- CreateIndex
CREATE INDEX "Products_gender_idx" ON "Products"("gender");

-- CreateIndex
CREATE INDEX "Products_size_idx" ON "Products"("size");

-- CreateIndex
CREATE INDEX "Products_brand_idx" ON "Products"("brand");

-- CreateIndex
CREATE INDEX "Products_is_new_idx" ON "Products"("is_new");

-- CreateIndex
CREATE INDEX "ProductVariant_color_idx" ON "ProductVariant"("color");

-- CreateIndex
CREATE INDEX "ProductVariant_url_idx" ON "ProductVariant"("url");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_productsId_key" ON "ProductInventory"("productsId");

-- CreateIndex
CREATE INDEX "ProductInventory_minStock_idx" ON "ProductInventory"("minStock");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_key" ON "categories"("category");

-- CreateIndex
CREATE INDEX "categories_category_idx" ON "categories"("category");

-- CreateIndex
CREATE INDEX "Coupon_isNew_idx" ON "Coupon"("isNew");

-- CreateIndex
CREATE INDEX "Coupon_isGlobal_idx" ON "Coupon"("isGlobal");

-- CreateIndex
CREATE INDEX "Coupon_espiryDate_idx" ON "Coupon"("espiryDate");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
