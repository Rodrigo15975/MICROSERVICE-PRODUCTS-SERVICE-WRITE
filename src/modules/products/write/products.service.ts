import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import {
  CreateProductDto,
  ProductDto,
  // ProductVariantDto,
} from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as Bluebird from 'bluebird'
import { HandledRpcException } from 'src/modules/utils/handle-errorst'
import { ProductsServiceRead } from '../read/product.service'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productServiceRead: ProductsServiceRead,
  ) {}

  async create(data: CreateProductDto) {
    const { products } = data
    await Bluebird.map(
      products,
      async (dataProducts, index) => {
        // const { product } = dataProducts
        // await this.verifyExistingProduct(product)
        this.logger.log('Processing product: ', index + 1)
        const newProduct = await this.createProducts(dataProducts)
        this.productServiceRead.create(newProduct, index + 1)
      },
      {
        concurrency: 5,
      },
    )
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Product creating successfully',
      HttpStatus.CREATED,
      ProductsService.name,
    )
  }

  // private async verifyExistingProduct(product: string) {
  //   const findProduct = await this.prismaService.products.findUnique({
  //     where: {
  //       product,
  //     },
  //   })
  //   if (findProduct)
  //     throw HandledRpcException.rpcException(
  //       `Product ${product} existing, can you update`,
  //       HttpStatus.CONFLICT,
  //     )
  // }
  private async createProducts(dataProduct: ProductDto) {
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
          create: productVariant.map(({ color }) => ({
            color,
            url: 'testing testing URL',
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

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log({ updateProductDto })
    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
