import { Prisma } from '@prisma/client'

export type CreateProductReadDto = Prisma.ProductsGetPayload<{
  include: {
    productInventory: true
    productVariant: true
    category: true
  }
}>

export type CreateOneVariantRead = Prisma.ProductVariantGetPayload<{
  include: {
    Products: false
  }
}>
