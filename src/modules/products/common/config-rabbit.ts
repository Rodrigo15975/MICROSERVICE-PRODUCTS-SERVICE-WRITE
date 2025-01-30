import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configRabbit = {
  EXCHANGE_NAME_DECREMENTE_STOCK: 'decrement.stock',
  QUEUE_NAME_DECREMENTE_STOCK: 'decrement.stock',
  ROUTING_KEY_DECREMENTE_STOCK: 'decrement.stock',
}

export const configQueue: RabbitMQQueueConfig[] = [
  {
    name: configRabbit.QUEUE_NAME_DECREMENTE_STOCK,
    routingKey: configRabbit.ROUTING_KEY_DECREMENTE_STOCK,
    exchange: configRabbit.EXCHANGE_NAME_DECREMENTE_STOCK,
    options: {
      durable: true,
    },
  },
]
export const configExchange: RabbitMQExchangeConfig[] = [
  {
    name: configRabbit.EXCHANGE_NAME_DECREMENTE_STOCK,

    type: 'direct',
    options: {
      durable: true,
    },
  },
]
