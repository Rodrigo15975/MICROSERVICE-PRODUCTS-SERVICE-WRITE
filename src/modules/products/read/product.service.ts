import { Inject, Injectable, Logger } from '@nestjs/common'
import { proxyName } from '../common/proxyName'
import { ClientProxy } from '@nestjs/microservices'
import { PRODUCTS_CREATE_READ } from '../common/patternRead'
import { CreateProductReadDto } from '../dto/create-product-read-dto'

@Injectable()
export class ProductsServiceRead {
  private readonly logger: Logger = new Logger(ProductsServiceRead.name)
  constructor(
    @Inject(proxyName.read) private readonly clientProductRead: ClientProxy,
  ) {}
  create(createProductDto: CreateProductReadDto, index: number) {
    try {
      console.log(createProductDto, index)

      this.clientProductRead.emit(PRODUCTS_CREATE_READ, createProductDto)
      this.logger.log('Send data product in DB READ: ', index)
      this.logger.log('DATA:', JSON.stringify(createProductDto))
    } catch (error) {
      this.logger.error('Failed to emit  PRODUCTS_CREATE_READ event: ', error)
    }
  }
  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #id `
  // }
  // remove(id: number) {
  //   return `This action removes a #id `
  // }
}
