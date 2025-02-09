import { Test, TestingModule } from '@nestjs/testing'
import { CreateProductDto } from 'src/modules/products/dto/create-product.dto'
import { ProductsService } from 'src/modules/products/write/products.service'
import { PrismaService } from 'src/prisma/prisma.service'

describe('ProductsService', () => {
  let service: ProductsService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            products: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      products: [
        {
          product: 'Product 1',
          brand: 'Brand 1',
          category: 'Category 1',
          description: 'Description 1',
          discount: 10,
          gender: 'Gender 1',
          is_new: true,
          price: 100,
          quantity: 10,
          size: ['Size 1', 'Size 2'],
          productInventory: {
            minStock: 10,
            productsId: 1,
            stock: true,
          },
          productVariant: [
            {
              color: 'Color 1',
              image: null,
              url: 'https://example.com/variant1.jpg',
              key_url: 'variant1',
            },
          ],
        },
      ],
    }
    const prismaCreateSpy = jest
      .spyOn(prismaService.products, 'create')
      .mockResolvedValue({} as any)

    const result = await service.create(createProductDto)

    expect(prismaCreateSpy).toHaveBeenCalledWith({
      data: createProductDto,
    })
    expect(result).toEqual({})
  })
})
