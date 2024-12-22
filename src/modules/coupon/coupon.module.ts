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
            retryAttempts: 10, // Número de intentos de reconexión
            retryDelay: 3000, // Milisegundos entre intentos
            autoResubscribe: true,
            reconnectOnError: (err: Error) => {
              // Lógica personalizada para reconectar en ciertos casos
              const targetError = 'READONLY'
              console.log(err)

              if (err.message.includes(targetError)) {
                return true // Reintentar reconexión si el error coincide
              }
              return false
            },
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
