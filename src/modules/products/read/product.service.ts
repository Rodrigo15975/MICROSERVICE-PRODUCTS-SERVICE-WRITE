import { Inject, Injectable, Logger } from '@nestjs/common'
import { proxyName } from '../common/proxyName'
import { ClientProxy } from '@nestjs/microservices'
import {
  PRODUCTS_CREATE_READ,
  PRODUCTS_REMOVE_READ,
} from '../common/patternRead'
import { CreateProductReadDto } from '../dto/create-product-read-dto'

@Injectable()
export class ProductsServiceRead {
  private readonly logger: Logger = new Logger(ProductsServiceRead.name)
  constructor(
    @Inject(proxyName.read) private readonly clientProductRead: ClientProxy,
  ) {}
  create(createProductDto: CreateProductReadDto, index: number) {
    try {
      this.clientProductRead.emit(PRODUCTS_CREATE_READ, createProductDto)
      this.logger.log(
        'Send data for CREATED/UPDATED product in DB READ: ',
        index,
      )
    } catch (error) {
      this.logger.error(
        'Failed to emit CREATED/UPDATED IN DB_READ PRODUCTS_CREATE_READ event: ',
        error,
      )
    }
  }
  remove(id: number) {
    try {
      this.clientProductRead.emit(PRODUCTS_REMOVE_READ, id)
    } catch (error) {
      this.logger.error(
        'Failed to emit in DB_READ  PRODUCTS_REMOVE_READ event: ',
        error,
      )
    }
  }
}
