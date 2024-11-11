import { Injectable } from '@nestjs/common'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    await this.prismaService.coupon.create({
      data: {
        discount: 4,
        espiryDate: new Date(),
        isGlobal: true,
        isNew: true,
        products: {
          connect: {
            id: 2,
          },
        },
        code: '',
      },
    })

    return createCouponDto
  }

  findAll() {
    return `This action returns all coupon`
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    console.log(updateCouponDto)
    return `This action updates a #${id} coupon`
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`
  }
}
