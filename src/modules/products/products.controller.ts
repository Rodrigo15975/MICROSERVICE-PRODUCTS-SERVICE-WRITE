import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  PRODUCTS_CREATE,
  PRODUCTS_CREATE_ONE_VARIANT,
  PRODUCTS_REMOVE,
  PRODUCTS_REMOVE_URL,
} from './common/patternWrite'
import { CreateOneVariant, CreateProductDto } from './dto/create-product.dto'
import { ProductsService } from './write/products.service'
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(PRODUCTS_CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }
  /**
   * @createOneVariant
   */
  @MessagePattern(PRODUCTS_CREATE_ONE_VARIANT)
  createOneVariant(@Payload() data: CreateOneVariant) {
    return this.productsService.createOneVariant(data)
  }

  @MessagePattern(PRODUCTS_REMOVE)
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }
  @MessagePattern(PRODUCTS_REMOVE_URL)
  removeUrl(@Payload() key: string) {
    return this.productsService.removeUrl(key)
  }
}
