import { Module } from '@nestjs/common';
import { TodoGrpcController } from './todo/todo-grpc.controller';
import { TodoService } from './todo/todo.service';

@Module({
  imports: [],
  controllers: [TodoGrpcController],
  providers: [TodoService],
})
export class TodoServiceModule {}
