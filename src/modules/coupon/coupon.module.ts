import { Module } from '@nestjs/common'
import { CouponService } from './coupon.service'
import { CouponController } from './coupon.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CouponReadService } from './read/coupon.read.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { proxyName } from './common/proxyNameRead'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: proxyName,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT') || 6379,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponReadService],
})
export class CouponModule {}
