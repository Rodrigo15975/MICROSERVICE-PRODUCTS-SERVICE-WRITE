import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      await this.prismaService.products.create({
        data: {
          brand: '',
          description: '',
          gender: '',
          size: ['M', 'L', 'XL'],
          is_new: true,
          price: 2,
          product: '',
          quantity: 2,
          category: {
            connect: {
              id: 5,
            },
          },
        },
      })
      console.log(createProductDto)
      return {}
    } catch (error) {
      console.error(error)
    }
  }

  findAll() {
    return `This action returns all products`
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log({ updateProductDto })

    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
