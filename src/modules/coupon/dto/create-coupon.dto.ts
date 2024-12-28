import { Prisma } from '@prisma/client'

export class CreateCouponDto
  implements Omit<Prisma.CouponCreateInput, 'products'>
{
  discount: number
  espiryDate: string
  isGlobal: boolean
  isNew: boolean
  code: string
  product: string | number | undefined | null
  isExpiredDate?: boolean
}
