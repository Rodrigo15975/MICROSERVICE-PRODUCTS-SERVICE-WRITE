import { Prisma } from '@prisma/client'

export type CreateCuoponDtoRead = Prisma.CouponGetPayload<{
  include: {
    products: {
      select: {
        id: true
        product: true
      }
    }
  }
}>
