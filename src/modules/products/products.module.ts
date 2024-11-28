import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProductsService } from './write/products.service'
import { ProductsServiceRead } from './read/product.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { proxyName } from './common/proxyName'

@Module({
  imports: [
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: proxyName.read,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            port: configService.getOrThrow('REDIS_PORT'),
            host: configService.getOrThrow('REDIS_HOST'),
            transport: Transport.REDIS,
            define: {
              timestamps: true,
            },
            log: ['query', 'error'],
            // keyPrefix: 'products:',
            // ignoreEnvVariables: true,
            // ssl: false,
            // connectionTimeoutMilliseconds: 10000,
            // idleTimeoutMilliseconds: 30000,
            // connectionLimit: 10,
            // acquireTimeoutMillis: 60000,
            // max: 10,
            // min: 0,
            maxRetriesPerRequest: 3,
            maxRetryTime: 10000,
            // maxIdleTimeMS: 30000,
            // maxWaitingTimeMS: 20000,
            // minWaitTimeMS: 100,
            // sslValidate: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsServiceRead],
})
export class ProductsModule {}
