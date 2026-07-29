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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('todos')
export class TodoController {
  private readonly temporaryUserId = 'temporary-user-123';

  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTodoDto,
  ): Promise<TodoResponse> {
    return this.todoService.createTodo(user.sub, dto);
  }

  @Get()
  async findAllTodos(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TodoResponse[]> {
    const response = await this.todoService.findAllTodos(user.sub);

    return response.todos;
  }

  @Get(':todoId')
  findOneTodo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('todoId') todoId: string,
  ): Promise<TodoResponse> {
    return this.todoService.findOneTodo(user.sub, todoId);
  }

  @Patch(':todoId')
  updateTodo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('todoId') todoId: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponse> {
    return this.todoService.updateTodo(user.sub, todoId, dto);
  }

  @Delete(':todoId')
  @HttpCode(HttpStatus.OK)
  deleteTodo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('todoId') todoId: string,
  ): Promise<DeleteTodoResponse> {
    return this.todoService.deleteTodo(user.sub, todoId);
  }
}
