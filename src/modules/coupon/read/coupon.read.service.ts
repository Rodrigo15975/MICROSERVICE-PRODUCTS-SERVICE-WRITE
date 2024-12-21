import { Inject, Injectable, Logger } from '@nestjs/common'
import { CreateCuoponDtoRead } from '../dto/create.coupon.dto.read'
import { proxyName } from '../common/proxyNameRead'
import { ClientProxy } from '@nestjs/microservices'
import {
  COUPON_CREATE_READ,
  COUPON_REMOVE_READ,
} from '../common/patterNameRead'

@Injectable()
export class CouponReadService {
  private logger: Logger = new Logger(CouponReadService.name)

  constructor(
    @Inject(proxyName) private readonly clientCouponRead: ClientProxy,
  ) {}

  createOrUpdate(createCuoponReadto: CreateCuoponDtoRead) {
    try {
      this.clientCouponRead.emit(COUPON_CREATE_READ, createCuoponReadto)
      this.logger.log('Send data for CREATED/UPDATED coupon in DB READ: ')
    } catch (error) {
      this.logger.error(
        'Failed to emit CREATED/UPDATED IN DB_READ COUPON_CREATE_READ event: ',
        error,
      )
      throw new Error(error)
    }
  }

  remove(id: number) {
    try {
      this.clientCouponRead.emit(COUPON_REMOVE_READ, id)
      this.logger.log('Send data for DELETED coupon in DB READ: ')
    } catch (error) {
      this.logger.error(
        'Failed to emit DELETED IN DB_READ COUPON_REMOVE_READ event: ',
        error,
      )
      throw new Error(error)
    }
  }
}
