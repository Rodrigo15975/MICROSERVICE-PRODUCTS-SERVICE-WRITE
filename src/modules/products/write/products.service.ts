import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Bluebird from 'bluebird'
import { lastValueFrom } from 'rxjs'
import { HandledRpcException } from 'src/modules/utils/handle-errorst'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  CreateOneVariant,
  CreateProductDto,
  ProductDto,
} from '../dto/create-product.dto'
import { ProductsServiceRead } from '../read/product.service'
import { UpdateProductDto } from '../dto/update-product.dto'
import { normalizeString } from 'src/modules/utils/normalizeString'
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { configRabbit } from '../common/config-rabbit'
import { OrdersClient } from '../dto/get-orders-decrement'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  private readonly apiUrlMicroservicesFiles: string = ''
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productServiceRead: ProductsServiceRead,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrlMicroservicesFiles = this.configService.getOrThrow(
      'API_MICROSERVICES_FILES',
    )
  }

  async create(data: CreateProductDto) {
    const { products } = data
    await Bluebird.map(
      products,
      async (dataProducts, index) => {
        this.logger.log('Processing product: ', index + 1)
        const newProduct = await this.createProductsOrUpdate(dataProducts)
        this.productServiceRead.createOrUpdate(newProduct, index + 1)
      },
      {
        concurrency: 5,
      },
    )
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Product creating successfully / Product updated successfully',
      HttpStatus.CREATED,
      ProductsService.name,
    )
  }

  private async createProductsOrUpdate(dataProduct: ProductDto) {
    const {
      product,
      brand,
      category,
      description,
      discount,
      gender,
      is_new,
      price,
      quantity,
      size,
      productInventory,
      productVariant,
    } = dataProduct
    const { minStock, stock } = productInventory
    const SizeUniques = [...new Set(size)]
    return await this.prismaService.products.upsert({
      create: {
        brand,
        category: {
          connect: {
            category,
          },
        },
        productInventory: {
          create: {
            minStock,
            stock,
          },
        },
        productVariant: {
          create: productVariant
            .filter(({ url }) => url)
            .map(({ color, url, key_url }) => ({
              color,
              url,
              key_url,
            })),
        },
        description,
        gender,
        is_new,
        discount,
        price,
        product,
        quantity,
        size: SizeUniques,
      },
      update: {
        price,
        quantity,
        productInventory: {
          update: {
            minStock,
            stock,
          },
        },
        category: {
          connect: {
            category,
          },
        },
        brand,
        description,
        gender,
        is_new,
        discount,
        product,
        size: SizeUniques,
      },
      include: {
        category: true,
        productInventory: true,
        productVariant: true,
      },
      where: {
        product,
      },
    })
  }

  async createOneVariant(data: CreateOneVariant) {
    const { id, color, key_url, url } = data
    try {
      const newOneVariant = await this.prismaService.productVariant.create({
        data: {
          color,
          url,
          key_url,
          Products: {
            connect: {
              id,
            },
          },
        },
      })
      this.productServiceRead.createOneVariant(newOneVariant)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Create successfully One Variant',
        HttpStatus.CREATED,
        ProductsService.name,
      )
    } catch (error) {
      this.logger.error(
        'Error creating One Variant of PRODUCT IN DB-WRITE',
        error,
      )
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async createSize(id: number, newSizes: string[]) {
    try {
      const findProduct = await this.findOneProduct(id)
      const updatedSizes = [
        ...(new Set(findProduct?.size) ?? []),
        ...new Set(newSizes),
      ]

      const updateProduct = await this.prismaService.products.update({
        where: {
          id,
        },
        data: {
          size: updatedSizes,
        },
      })
      this.productServiceRead.createOrUpdate(updateProduct)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Size create successfully',
        HttpStatus.OK,
        ProductsService.name,
      )
    } catch (error) {
      this.logger.error('Error creating Size of PRODUCT IN DB-WRITE', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }
  async update(id: number, data: UpdateProductDto) {
    const {
      product,
      brand,
      category,
      description,
      discount,
      gender,
      minStock,
      price,
      quantity,
    } = data
    const findProduct = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    })

    if (normalizeString(findProduct?.product) !== normalizeString(product)) {
      const verifyProduct = await this.prismaService.products.findFirst({
        where: {
          product: {
            equals: product,
            mode: 'insensitive',
          },
        },
      })
      if (verifyProduct) {
        throw HandledRpcException.rpcException(
          `Already existing product ${product}`,
          HttpStatus.CONFLICT,
        )
      }
    }
    const updateProduct = await this.prismaService.products.update({
      data: {
        product,
        brand,
        category: {
          connect: {
            category,
          },
        },
        description,
        discount,
        gender,
        productInventory: {
          update: {
            minStock,
            stock: quantity && minStock && quantity <= minStock ? true : false,
          },
        },
        price,
        quantity,
      },
      include: {
        category: true,
        productInventory: true,
      },
      where: {
        id,
      },
    })

    this.productServiceRead.createOrUpdate(updateProduct)
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Product updated successfully',
      HttpStatus.OK,
      ProductsService.name,
    )
  }

  @RabbitSubscribe({
    exchange: configRabbit.EXCHANGE_NAME_DECREMENTE_STOCK,
    routingKey: configRabbit.QUEUE_NAME_DECREMENTE_STOCK,
    queue: configRabbit.QUEUE_NAME_DECREMENTE_STOCK,
  })
  public decrementStockInventory(@RabbitPayload() data: OrdersClient) {
    const { dataFormat } = data
    const dataDecrement = dataFormat.map((item) => ({
      id: item.id,
      quantity: item.quantity_buy,
    }))
    this.logger.debug('Decrement stock', dataDecrement)
  }

  private async deleteUrl(key: string) {
    await lastValueFrom(
      this.httpService.delete(
        `${this.apiUrlMicroservicesFiles}/files?key=${key}`,
      ),
    )
  }

  private async productVariantDeleteUrl(idProduct: number) {
    try {
      const findProductsVariants = await this.findAllProductsVariant(idProduct)
      Bluebird.map(
        findProductsVariants,
        async (variant) => await this.deleteUrl(variant.key_url),

        {
          concurrency: 5,
        },
      )
      this.logger.log('Deleted successfully')
    } catch (error) {
      this.logger.error('Error deleting URL', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  private async findAllProductsVariant(productsId: number) {
    return await this.prismaService.productVariant.findMany({
      where: {
        productsId,
      },
    })
  }

  private async findOneProduct(id: number) {
    return await this.prismaService.products.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   *
   * @param id
   *
   */
  async remove(id: number) {
    try {
      await this.productVariantDeleteUrl(id)
      await this.prismaService.products.delete({
        where: {
          id,
        },
      })
      this.productServiceRead.remove(id)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Product deleted successfully',
        HttpStatus.OK,
        ProductsService.name,
        id,
      )
    } catch (error) {
      this.logger.log('Error get product by ID in DB-WRITE', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }
  /**
   * @Param key url for delete
   */
  async removeUrl(key_url: string) {
    try {
      const variant = await this.prismaService.productVariant.findFirst({
        where: {
          key_url,
        },
      })
      await this.prismaService.productVariant.delete({
        where: {
          id: variant?.id,
        },
      })

      await this.deleteUrl(key_url)
      this.productServiceRead.removeUrl(key_url)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Deleted url successfully',
        HttpStatus.OK,
        ProductsService.name,
      )
    } catch (error) {
      this.logger.error('Error deleting URL', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  /**
   * @RemoveOneSize
   * @Param id
   */
  async removeOneSize(id: number, sizeToRemove: string) {
    try {
      const findProduct = await this.findOneProduct(id)
      const updatedSizes = findProduct?.size.filter(
        (size) => size !== sizeToRemove,
      )
      const updateProduct = await this.prismaService.products.update({
        data: {
          size: updatedSizes,
        },
        where: {
          id,
        },
      })
      this.productServiceRead.removeOneSize(updateProduct)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Size Delete successfully',
        HttpStatus.OK,
        ProductsService.name,
        id,
      )
    } catch (error) {
      this.logger.log('Error get product by ID in DB-WRITE', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }
}
