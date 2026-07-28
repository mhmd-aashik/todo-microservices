import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  TODO_SERVICE_NAME,
  TodoResponse,
  TodoServiceClient,
} from '@app/grpc-contracts';

import { CreateTodoDto } from './dto/create-todo.dto';
import { TODO_GRPC_CLIENT } from './todo.constants';

@Injectable()
export class TodoService implements OnModuleInit {
  private todoGrpcService!: TodoServiceClient;

  constructor(
    @Inject(TODO_GRPC_CLIENT)
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.todoGrpcService =
      this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME);
  }

  async createTodo(userId: string, dto: CreateTodoDto): Promise<TodoResponse> {
    const response$ = this.todoGrpcService.createTodo({
      userId,
      title: dto.title,
      description: dto.description,
    });

    return lastValueFrom(response$);
  }
}
