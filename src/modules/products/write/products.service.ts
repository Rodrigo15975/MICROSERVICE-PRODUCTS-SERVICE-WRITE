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
        // const { product } = dataProducts
        // await this.verifyExistingProduct(product)
        this.logger.log('Processing product: ', index + 1)
        const newProduct = await this.createProductsOrUpdate(dataProducts)
        this.productServiceRead.create(newProduct, index + 1)
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
            .filter(({ url }) => url) // Solo incluye elementos que tengan `url` definido
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
        size,
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
        size,
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
}
