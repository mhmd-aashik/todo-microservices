import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { CreateTodoRequest, UpdateTodoRequest } from '@app/grpc-contracts';

import { todoNotFoundException } from './todo.errors';
import type { Todo } from './todo.types';

@Injectable()
export class TodoService {
  private readonly todos = new Map<string, Todo>();

  create(request: CreateTodoRequest): Todo {
    const now = new Date();

    const todo: Todo = {
      id: randomUUID(),
      userId: request.userId,
      title: request.title.trim(),
      description: request.description?.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.set(todo.id, todo);

    return todo;
  }

  findAllByUserId(userId: string): Todo[] {
    return Array.from(this.todos.values()).filter(
      (todo) => todo.userId === userId,
    );
  }

  findOneByUserId(userId: string, todoId: string): Todo {
    const todo = this.todos.get(todoId);

    if (!todo || todo.userId !== userId) {
      throw todoNotFoundException();
    }

    return todo;
  }

  update(request: UpdateTodoRequest): Todo {
    const todo = this.findOneByUserId(request.userId, request.todoId);

    const updatedTodo: Todo = {
      ...todo,
      title: request.title !== undefined ? request.title.trim() : todo.title,
      description:
        request.description !== undefined
          ? request.description.trim()
          : todo.description,
      completed:
        request.completed !== undefined ? request.completed : todo.completed,
      updatedAt: new Date(),
    };

    this.todos.set(todo.id, updatedTodo);

    return updatedTodo;
  }

  delete(userId: string, todoId: string): boolean {
    const todo = this.findOneByUserId(userId, todoId);

    return this.todos.delete(todo.id);
  }
}
