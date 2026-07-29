import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoGrpcController } from './todo-grpc.controller';

@Module({
  imports: [],
  controllers: [TodoGrpcController],
  providers: [TodoService],
})
export class TodoModule {}
