import { Controller } from '@nestjs/common';

import {
  CreateTodoRequest,
  DeleteTodoRequest,
  DeleteTodoResponse,
  FindAllTodosRequest,
  FindAllTodosResponse,
  FindOneTodoRequest,
  TodoResponse,
  TodoServiceController,
  TodoServiceControllerMethods,
  UpdateTodoRequest,
} from '@app/grpc-contracts';

import { toTodoResponse } from './todo.mapper';
import { TodoService } from './todo.service';

@Controller()
@TodoServiceControllerMethods()
export class TodoGrpcController implements TodoServiceController {
  constructor(private readonly todoService: TodoService) {}

  async createTodo(request: CreateTodoRequest): Promise<TodoResponse> {
    const todo = await this.todoService.create(request);

    return toTodoResponse(todo);
  }

  async findAllTodos(
    request: FindAllTodosRequest,
  ): Promise<FindAllTodosResponse> {
    const todos = await this.todoService.findAllByUserId(request.userId);

    return {
      todos: todos.map(toTodoResponse),
    };
  }

  async findOneTodo(request: FindOneTodoRequest): Promise<TodoResponse> {
    const todo = await this.todoService.findOneByUserId(
      request.userId,
      request.todoId,
    );

    return toTodoResponse(todo);
  }

  async updateTodo(request: UpdateTodoRequest): Promise<TodoResponse> {
    const todo = await this.todoService.update(request);

    return toTodoResponse(todo);
  }

  async deleteTodo(request: DeleteTodoRequest): Promise<DeleteTodoResponse> {
    const deleted = await this.todoService.delete(
      request.userId,
      request.todoId,
    );

    return {
      deleted,
    };
  }
}
