import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import type { DeleteTodoResponse, TodoResponse } from '@app/grpc-contracts';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  private readonly temporaryUserId = 'temporary-user-123';

  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@Body() dto: CreateTodoDto): Promise<TodoResponse> {
    return this.todoService.createTodo(this.temporaryUserId, dto);
  }

  @Get()
  async findAllTodos(): Promise<TodoResponse[]> {
    const response = await this.todoService.findAllTodos(this.temporaryUserId);

    return response.todos;
  }

  @Get(':todoId')
  findOneTodo(@Param('todoId') todoId: string): Promise<TodoResponse> {
    return this.todoService.findOneTodo(this.temporaryUserId, todoId);
  }

  @Patch(':todoId')
  updateTodo(
    @Param('todoId') todoId: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponse> {
    return this.todoService.updateTodo(this.temporaryUserId, todoId, dto);
  }

  @Delete(':todoId')
  @HttpCode(HttpStatus.OK)
  deleteTodo(@Param('todoId') todoId: string): Promise<DeleteTodoResponse> {
    return this.todoService.deleteTodo(this.temporaryUserId, todoId);
  }
}
