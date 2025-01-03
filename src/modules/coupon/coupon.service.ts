import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { HandledRpcException } from '../utils/handle-errorst'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { CouponReadService } from './read/coupon.read.service'
import { convertedDateISO } from '../utils/validation-date'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { configPublish } from './common/configRabbitMQ'

@Injectable()
export class CouponService {
  private readonly logger: Logger = new Logger(CouponService.name)
  constructor(
    private readonly prismaService: PrismaService,
    private readonly couponServiceRead: CouponReadService,
  ) {}

  @RabbitSubscribe({
    exchange: configPublish.ROUTING_EXCHANGE_CREATE_COUPON_WRITE,
    routingKey: configPublish.ROUTING_ROUTINGKEY_CREATE_COUPON_WRITE,
    queue: configPublish.QUEUE_CREATE_COUPON,
  })
  createCuoponIfClientNotExist(idUserGoogle: string) {
    console.log({
      idUserGoogle,
      message: 'recieved',
    })
  }

  async createOrUpdate(createCouponDto: CreateCouponDto) {
    try {
      const { code, discount, isGlobal, isNew, product, isExpiredDate } =
        createCouponDto
      const espiryDate = convertedDateISO(createCouponDto.espiryDate)
      const couponIsExpired = isExpiredDate ? false : true
      const coupon = await this.prismaService.coupon.upsert({
        create: {
          code,
          discount,
          espiryDate,
          isGlobal,
          isNew,
          products: product ? { connect: { id: Number(product) } } : undefined,
        },
        update: {
          code,
          discount,
          espiryDate,
          isGlobal,
          isNew: couponIsExpired,
          products: product
            ? { connect: { id: Number(product) } }
            : {
                disconnect: true,
              },
        },
        where: {
          code,
        },
        include: {
          products: {
            select: {
              id: true,
              product: true,
            },
          },
        },
      })

      this.couponServiceRead.createOrUpdate(coupon)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Coupon created successfully/Coupon updated successfully',
        HttpStatus.CREATED,
        CouponService.name,
      )
    } catch (error) {
      this.logger.error('Error creating coupon', error.message)
      throw HandledRpcException.rpcException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: number) {
    try {
      console.log({ id })

      await this.prismaService.coupon.delete({
        where: {
          id,
        },
      })
      this.couponServiceRead.remove(id)
      return HandledRpcException.ResponseSuccessfullyMessagePattern(
        'Coupon deleted successfully',
        HttpStatus.OK,
        CouponService.name,
      )
    } catch (error) {
      this.logger.error('Error removing coupon', error.message)
      throw HandledRpcException.rpcException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
