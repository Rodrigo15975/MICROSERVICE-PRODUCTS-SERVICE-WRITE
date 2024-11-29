import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import * as Bluebird from 'bluebird'
import { HandledRpcException } from 'src/modules/utils/handle-errorst'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductDto, ProductDto } from '../dto/create-product.dto'
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
    console.log(products)

    // return { messagE: 'ready here ' }
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
      'Product creating successfully / Product updated successfully',
      HttpStatus.CREATED,
      ProductsService.name,
    )
  }

  private async createProducts(dataProduct: ProductDto) {
    const {
      product,
      brand,
      // category,
      description,
      discount,
      gender,
      is_new,
      price,
      quantity,
      // size,
      // productInventory,
      productVariant,
    } = dataProduct
    // const { minStock, stock } = productInventory
    return await this.prismaService.products.upsert({
      create: {
        brand,
        category: {
          connect: {
            category: 'ADIDAS',
          },
        },
        productInventory: {
          create: {
            minStock: 2,
            stock: false,
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
        size: ['M', 'F'],
      },
      update: {
        price,
        quantity,
        productInventory: {
          update: {
            minStock: 3,
            stock: false,
          },
        },
        category: {
          connect: {
            category: 'ADIDAS',
          },
        },
        brand,
        description,
        gender,
        is_new,
        discount,
        product,
        size: ['M', 'F'],
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

  /**
   *
   * @param id
   *
   */
  async remove(id: number) {
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
  }
}
