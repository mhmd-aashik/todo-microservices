import { Body, Controller, Post } from '@nestjs/common';

import type { TodoResponse } from '@app/grpc-contracts';

import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@Body() dto: CreateTodoDto): Promise<TodoResponse> {
    const temporaryUserId = 'temporary-user-123';

    return this.todoService.createTodo(temporaryUserId, dto);
  }
}
