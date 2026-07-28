import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import type { CreateTodoRequest } from '@app/grpc-contracts';
import type { Todo } from './todo.types';

@Injectable()
export class TodoService {
  private readonly todos = new Map<string, Todo>();

  create(request: CreateTodoRequest): Todo {
    const now = new Date();

    const todo: Todo = {
      id: randomUUID(),
      userId: request.userId,
      title: request.title,
      description: request.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.set(todo.id, todo);

    return todo;
  }
}
