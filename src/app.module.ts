import { Module } from '@nestjs/common'
import { ProductsModule } from './modules/products/products.module'
import { PrismaModule } from './prisma/prisma.module'
import { CategoryModule } from './modules/category/category.module'
import { CouponModule } from './modules/coupon/coupon.module'

@Module({
  imports: [ProductsModule, PrismaModule, CategoryModule, CouponModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
