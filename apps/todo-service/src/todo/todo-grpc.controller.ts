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

  createTodo(request: CreateTodoRequest): TodoResponse {
    const todo = this.todoService.create(request);

    return toTodoResponse(todo);
  }

  findAllTodos(request: FindAllTodosRequest): FindAllTodosResponse {
    const todos = this.todoService.findAllByUserId(request.userId);

    return {
      todos: todos.map(toTodoResponse),
    };
  }

  findOneTodo(request: FindOneTodoRequest): TodoResponse {
    const todo = this.todoService.findOneByUserId(
      request.userId,
      request.todoId,
    );

    return toTodoResponse(todo);
  }

  updateTodo(request: UpdateTodoRequest): TodoResponse {
    const todo = this.todoService.update(request);

    return toTodoResponse(todo);
  }

  deleteTodo(request: DeleteTodoRequest): DeleteTodoResponse {
    const deleted = this.todoService.delete(request.userId, request.todoId);

    return {
      deleted,
    };
  }
}
