import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PrismaModule } from 'src/prisma/prisma.module'
import { configExchange, configQueue } from './common/config-rabbit'
import { proxyName } from './common/proxyName'
import { ProductsController } from './products.controller'
import { ProductsServiceRead } from './read/product.service'
import { ProductsService } from './write/products.service'

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('RABBITMQ_URL'),
        exchanges: configExchange,
        queues: configQueue,
      }),
      inject: [ConfigService],
    }),
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
            retryDelay: 1000,
            log: ['query', 'error'],
            retryAttempts: 5,
            autoResubscribe: true,
            keyPrefix: 'products:',
            ignoreEnvVariables: true,
            ssl: false,
            connectionTimeoutMilliseconds: 10000,
            idleTimeoutMilliseconds: 30000,
            connectionLimit: 10,
            acquireTimeoutMillis: 60000,
            max: 10,
            min: 0,
            maxRetriesPerRequest: 10,
            maxRetryTime: 10000,
            maxIdleTimeMS: 30000,
            maxWaitingTimeMS: 20000,
            minWaitTimeMS: 100,
            sslValidate: true,
            tlsOptions: {
              rejectUnauthorized: true,
            },
            reconnectOnError: (error) => {
              const targetError = 'READONLY'
              console.error(error)
              if (error.message.includes(targetError)) return true

              return true
            },
            connectionName: 'products',
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
