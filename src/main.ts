import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('MICROSERVICE  PRODUCTS')
    .setDescription('Products')
    .setVersion('1.0')
    .addTag('products')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('MICROSERVICE-PRODUCTS', app, documentFactory)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  })
  app.enableCors({
    credentials: true,
    origin: true,
  })
  await app.startAllMicroservices()
  const port = Number(process.env.PORT) || 4004
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  await app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}
bootstrap()
