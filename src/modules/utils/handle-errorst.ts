import { HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

export class HandledRpcException {
  static rpcException(message: string, statusCode: HttpStatus) {
    throw new RpcException({
      message,
      statusCode,
    })
  }

  static RpcExceptionUknow(error: unknown | any) {
    throw new RpcException({ error, statusCode: HttpStatus.BAD_REQUEST })
  }

  static ResponseSuccessfullyMessagePattern(
    message: string,
    statusCode: number,
    service: string,
  ) {
    return {
      message,
      statusCode,
      service,
      timestamp: new Date().toISOString(),
    }
  }
}
