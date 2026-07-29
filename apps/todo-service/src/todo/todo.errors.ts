import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export function todoNotFoundException(): RpcException {
  return new RpcException({
    code: status.NOT_FOUND,
    message: 'Todo not found',
  });
}
