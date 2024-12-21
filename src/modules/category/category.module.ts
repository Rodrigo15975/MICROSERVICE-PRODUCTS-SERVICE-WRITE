import { Module } from '@nestjs/common'
import { CategoryService } from './write/category.service'
import { CategoryController } from './category.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { proxyName } from './common/proxyName'
import { CategoryServiceRead } from './read/category.read.service'
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
        name: proxyName.nameRead,
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
  controllers: [CategoryController],
  providers: [CategoryService, CategoryServiceRead],
})
export class CategoryModule {}
