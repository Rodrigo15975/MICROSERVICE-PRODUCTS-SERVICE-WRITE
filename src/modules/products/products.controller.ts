import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PRODUCTS_CREATE, PRODUCTS_REMOVE } from './common/patternWrite'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductsService } from './write/products.service'
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(PRODUCTS_CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @MessagePattern(PRODUCTS_REMOVE)
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }
}
