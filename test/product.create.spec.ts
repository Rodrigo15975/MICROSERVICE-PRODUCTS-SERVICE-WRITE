import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { ProductsService } from 'src/modules/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

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
    }).compile();

    service = module.get<ProductsService>(ProductsService); 
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      brand: 'Test Brand',
      description: 'Test Description',
      gender: 'Unisex',
      is_new: true,
      price: 100,
      product: 'Test Product',
      quantity: 10,
      category: {
        create: {
          category: 'Test Category',
        },
      },
      size: ['S', 'M', 'L'],
      post: {
        create: {
          comments: 'Test Comment',
          rating: 5,
          username: 'testuser',
        },
      },
      discount: 10,
      productInventory: {
        create: {
          stock: true,
          minStock: 5,
        },
      },
      productVariant: {
        create: [
          {
            color: 'Red',
            url: 'http://example.com/red',
          },
          {
            color: 'Blue',
            url: 'http://example.com/blue',
          },
        ],
      },
    };

    const prismaCreateSpy = jest.spyOn(prismaService.products, 'create').mockResolvedValue({} as any);

    const result = await service.create(createProductDto);

    expect(prismaCreateSpy).toHaveBeenCalledWith({
      data: createProductDto,
    });
    expect(result).toEqual({});
  });
});
