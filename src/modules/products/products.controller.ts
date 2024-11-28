import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UpdateProductDto } from './dto/update-product.dto'
import { PRODUCTS_CREATE } from './common/patternWrite'
import { ProductsService } from './write/products.service'
import { CreateProductDto } from './dto/create-product.dto'
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(PRODUCTS_CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @MessagePattern('updateProduct')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto)
  }

  @MessagePattern('removeProduct')
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }
}
