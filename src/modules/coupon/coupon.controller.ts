import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { COUPON_CREATE, COUPON_REMOVE } from './common/patterNameWrite'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @MessagePattern(COUPON_CREATE)
  create(@Payload() createCouponDto: CreateCouponDto) {
    return this.couponService.createOrUpdate(createCouponDto)
  }

  @MessagePattern(COUPON_REMOVE)
  remove(@Payload() id: number) {
    return this.couponService.remove(id)
  }
}
