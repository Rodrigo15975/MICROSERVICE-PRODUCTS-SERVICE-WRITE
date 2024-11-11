import { Module } from '@nestjs/common'
import { CategoryService } from './write/category.service'
import { CategoryController } from './category.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { proxyName } from './common/proxyName'
import { CategoryServiceRead } from './read/category.read.service'

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: proxyName.nameRead,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryServiceRead],
})
export class CategoryModule {}
