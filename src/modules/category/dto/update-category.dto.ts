import { PartialType } from '@nestjs/mapped-types'
import {
  CreateCategoryDto,
  CreateDiscountRulesCategory,
} from './create-category.dto'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  id: number
}
export class UpdateDiscountRulesCategory extends PartialType(
  CreateDiscountRulesCategory,
) {
  categoryId?: number
  id: number
}
