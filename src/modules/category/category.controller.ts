import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CategoryService } from './write/category.service'
import {
  CreateCategoryDto,
  CreateCategoryManyDto,
  CreateDiscountRulesCategory,
} from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import {
  CATEGORY_CREATE,
  CATEGORY_UPDATE,
  CATEGORY_DELETE,
  CATEGORY_CREATE_MANY,
  CATEGORY_CREATE_DISCOUNT,
  CATEGORY_DELETE_DISCOUNT,
  CATEGORY_UPDATE_DISCOUNT,
} from './common/patternWrite'

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(CATEGORY_CREATE)
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }
  @MessagePattern(CATEGORY_CREATE_DISCOUNT)
  createDiscount(
    @Payload() createDiscountRulesCategory: CreateDiscountRulesCategory,
  ) {
    return this.categoryService.createDiscount(createDiscountRulesCategory)
  }

  @MessagePattern(CATEGORY_CREATE_MANY)
  createMany(@Payload() createCategoryDto: CreateCategoryManyDto) {
    return this.categoryService.createMany(createCategoryDto)
  }

  @MessagePattern(CATEGORY_UPDATE)
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto)
  }
  @MessagePattern(CATEGORY_UPDATE_DISCOUNT)
  updateDiscountWithCategory(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateDiscountWithCategory(
      updateCategoryDto.id,
      updateCategoryDto,
    )
  }

  @MessagePattern(CATEGORY_DELETE)
  remove(@Payload() id: number) {
    return this.categoryService.remove(id)
  }
  @MessagePattern(CATEGORY_DELETE_DISCOUNT)
  removeDiscount(@Payload() id: number) {
    return this.categoryService.removeDiscount(id)
  }
}
