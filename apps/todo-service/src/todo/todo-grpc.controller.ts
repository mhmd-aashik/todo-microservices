import { Controller } from '@nestjs/common';

import {
  CreateTodoRequest,
  TodoResponse,
  TodoServiceController,
  TodoServiceControllerMethods,
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

  findAllTodos(): never {
    throw new Error('Not implemented');
  }

  findOneTodo(): never {
    throw new Error('Not implemented');
  }

  updateTodo(): never {
    throw new Error('Not implemented');
  }

  deleteTodo(): never {
    throw new Error('Not implemented');
  }
}
