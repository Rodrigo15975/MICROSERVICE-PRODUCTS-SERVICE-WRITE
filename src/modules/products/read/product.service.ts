import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  PRODUCTS_CREATE_ONE_VARIANT_READ,
  PRODUCTS_CREATE_READ,
  PRODUCTS_REMOVE_READ,
  PRODUCTS_REMOVE_SIZE_READ,
  PRODUCTS_REMOVE_URL_READ,
} from '../common/patternRead'
import { proxyName } from '../common/proxyName'
import {
  CreateOneVariantRead,
  CreateProductReadDto,
  UpdateOneProductRead,
  UpdateOneProductSizeRead,
} from '../dto/create-product-read-dto'

@Injectable()
export class ProductsServiceRead {
  private readonly logger: Logger = new Logger(ProductsServiceRead.name)
  constructor(
    @Inject(proxyName.read) private readonly clientProductRead: ClientProxy,
  ) {}
  createOrUpdate(
    createProductDto:
      | CreateProductReadDto
      | UpdateOneProductRead
      | UpdateOneProductSizeRead,
    index: number = 1,
  ) {
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
      throw new Error(error)
    }
  }
  createOneVariant(data: CreateOneVariantRead) {
    try {
      this.clientProductRead.emit(PRODUCTS_CREATE_ONE_VARIANT_READ, data)
    } catch (error) {
      this.logger.error(
        'Failed to emit in DB_READ  PRODUCTS_CREATE_ONE_VARIANT_READ event: ',
        error,
      )
      throw new Error(error)
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
      throw new Error(error)
    }
  }
  removeUrl(key_url: string) {
    try {
      this.clientProductRead.emit(PRODUCTS_REMOVE_URL_READ, key_url)
    } catch (error) {
      this.logger.error(
        'Failed to emit in DB_READ  PRODUCTS_REMOVE_URLS_READ event: ',
        error,
      )
      throw new Error(error)
    }
  }

  removeOneSize(data: UpdateOneProductSizeRead) {
    try {
      this.clientProductRead.emit(PRODUCTS_REMOVE_SIZE_READ, data)
    } catch (error) {
      this.logger.error(
        'Failed to emit in DB_READ  PRODUCTS_REMOVE_SIZE_READ event: ',
        error,
      )
      throw new Error(error)
    }
  }
}
