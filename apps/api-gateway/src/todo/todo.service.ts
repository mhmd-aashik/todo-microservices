import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  DeleteTodoResponse,
  FindAllTodosResponse,
  TODO_SERVICE_NAME,
  TodoResponse,
  TodoServiceClient,
} from '@app/grpc-contracts';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
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

  createTodo(userId: string, dto: CreateTodoDto): Promise<TodoResponse> {
    return lastValueFrom(
      this.todoGrpcService.createTodo({
        userId,
        title: dto.title,
        description: dto.description,
      }),
    );
  }

  findAllTodos(userId: string): Promise<FindAllTodosResponse> {
    return lastValueFrom(
      this.todoGrpcService.findAllTodos({
        userId,
      }),
    );
  }

  findOneTodo(userId: string, todoId: string): Promise<TodoResponse> {
    return lastValueFrom(
      this.todoGrpcService.findOneTodo({
        userId,
        todoId,
      }),
    );
  }

  updateTodo(
    userId: string,
    todoId: string,
    dto: UpdateTodoDto,
  ): Promise<TodoResponse> {
    const hasUpdate =
      dto.title !== undefined ||
      dto.description !== undefined ||
      dto.completed !== undefined;

    if (!hasUpdate) {
      throw new BadRequestException('At least one Todo field must be provided');
    }

    return lastValueFrom(
      this.todoGrpcService.updateTodo({
        userId,
        todoId,
        title: dto.title,
        description: dto.description,
        completed: dto.completed,
      }),
    );
  }

  deleteTodo(userId: string, todoId: string): Promise<DeleteTodoResponse> {
    return lastValueFrom(
      this.todoGrpcService.deleteTodo({
        userId,
        todoId,
      }),
    );
  }
}
