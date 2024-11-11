import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { COUPON_CREATE } from './common/patterNameWrite'

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @MessagePattern(COUPON_CREATE)
  create(@Payload() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto)
  }

  @MessagePattern('findAllCoupon')
  findAll() {
    return this.couponService.findAll()
  }

  @MessagePattern('findOneCoupon')
  findOne(@Payload() id: number) {
    return this.couponService.findOne(id)
  }

  @MessagePattern('updateCoupon')
  update(@Payload() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(updateCouponDto.id, updateCouponDto)
  }

  @MessagePattern('removeCoupon')
  remove(@Payload() id: number) {
    return this.couponService.remove(id)
  }
}
