import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configPublish = {
  ROUTING_EXCHANGE_CREATE_COUPON_WRITE: 'client.create.coupon.write',
  ROUTING_ROUTINGKEY_CREATE_COUPON_WRITE: 'client.create.coupon.write',
  QUEUE_CREATE_COUPON: 'client.create.coupon.write',
}

export const configQueue: RabbitMQQueueConfig[] = [
  {
    name: 'client.create.coupon.write',
    routingKey: 'client.create.coupon.write',
    exchange: 'client.create.coupon.write',
  },
]

export const configExchange: RabbitMQExchangeConfig[] = [
  {
    name: 'client.create.coupon.write',
    type: 'direct',
  },
]
