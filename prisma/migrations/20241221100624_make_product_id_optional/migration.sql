-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "size" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "gender" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_sold" INTEGER,
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
    "key_url" TEXT NOT NULL,
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
    "code" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "productsId" INTEGER,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_rules" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_product_key" ON "Products"("product");

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
CREATE UNIQUE INDEX "ProductVariant_key_url_key" ON "ProductVariant"("key_url");

-- CreateIndex
CREATE INDEX "ProductVariant_color_idx" ON "ProductVariant"("color");

-- CreateIndex
CREATE INDEX "ProductVariant_url_idx" ON "ProductVariant"("url");

-- CreateIndex
CREATE INDEX "ProductVariant_key_url_idx" ON "ProductVariant"("key_url");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_productsId_key" ON "ProductInventory"("productsId");

-- CreateIndex
CREATE INDEX "ProductInventory_minStock_idx" ON "ProductInventory"("minStock");

-- CreateIndex
CREATE INDEX "Post_username_idx" ON "Post"("username");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_key" ON "categories"("category");

-- CreateIndex
CREATE INDEX "categories_category_idx" ON "categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_isNew_idx" ON "Coupon"("isNew");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_isGlobal_idx" ON "Coupon"("isGlobal");

-- CreateIndex
CREATE INDEX "Coupon_espiryDate_idx" ON "Coupon"("espiryDate");

-- CreateIndex
CREATE INDEX "discount_rules_is_active_idx" ON "discount_rules"("is_active");

-- CreateIndex
CREATE INDEX "discount_rules_start_date_idx" ON "discount_rules"("start_date");

-- CreateIndex
CREATE INDEX "discount_rules_end_date_idx" ON "discount_rules"("end_date");

-- CreateIndex
CREATE INDEX "discount_rules_categoryId_idx" ON "discount_rules"("categoryId");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
