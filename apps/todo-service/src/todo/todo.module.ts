import { Module } from '@nestjs/common';

import { TodoGrpcController } from './todo-grpc.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoGrpcController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
