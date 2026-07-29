import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export function todoNotFoundException(): RpcException {
  return new RpcException({
    code: status.NOT_FOUND,
    message: 'Todo not found',
  });
}

export function invalidTodoTitleException(): RpcException {
  return createRpcException(
    status.INVALID_ARGUMENT,
    'Todo title cannot be empty',
  );
}

function createRpcException(code: status, message: string): RpcException {
  return new RpcException({
    code,
    message,
  });
}
