import { Prisma } from '@prisma/client'

export class CreateCategoryDto implements Prisma.CategoryCreateInput {
  category: string
}

export class CreateCategoryManyDto {
  categories: CreateCategoryDto[]
}

export class SendCategoryManyDto extends CreateCategoryDto {
  id: number
}

export class CreateDiscountRulesCategory {
  discount: number
  start_date: string
  end_date: string
  is_active: boolean
  id: number
}

export type CreateDiscountRulesWithCategoryInDBReadDto =
  Prisma.CategoryGetPayload<{
    include: { discountRules: true }
  }> | null

export type UpdateDiscountRulesWithCategoryInDBReadDto =
  CreateDiscountRulesCategory
