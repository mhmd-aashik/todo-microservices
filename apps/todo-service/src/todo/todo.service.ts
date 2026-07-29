import { Injectable } from '@nestjs/common';

import type { CreateTodoRequest, UpdateTodoRequest } from '@app/grpc-contracts';

import {
  invalidTodoTitleException,
  todoNotFoundException,
} from './todo.errors';
import { TodoRepository } from './todo.repository';
import type { Todo } from './todo.types';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  create(request: CreateTodoRequest): Promise<Todo> {
    const title = request.title.trim();

    if (!title) {
      throw invalidTodoTitleException();
    }

    return this.todoRepository.create({
      userId: request.userId,
      title,
      description: this.normalizeOptionalDescription(request.description),
    });
  }

  findAllByUserId(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllByUserId(userId);
  }

  async findOneByUserId(userId: string, todoId: string): Promise<Todo> {
    const todo = await this.todoRepository.findOneByUserId(userId, todoId);

    if (!todo) {
      throw todoNotFoundException();
    }

    return todo;
  }

  async update(request: UpdateTodoRequest): Promise<Todo> {
    const updateData: {
      title?: string;
      description?: string | null;
      completed?: boolean;
    } = {};

    if (request.title !== undefined) {
      const title = request.title.trim();

      if (!title) {
        throw invalidTodoTitleException();
      }

      updateData.title = title;
    }

    if (request.description !== undefined) {
      updateData.description = this.normalizeNullableDescription(
        request.description,
      );
    }

    if (request.completed !== undefined) {
      updateData.completed = request.completed;
    }

    const todo = await this.todoRepository.updateByUserId(
      request.userId,
      request.todoId,
      updateData,
    );

    if (!todo) {
      throw todoNotFoundException();
    }

    return todo;
  }

  async delete(userId: string, todoId: string): Promise<boolean> {
    const deleted = await this.todoRepository.deleteByUserId(userId, todoId);

    if (!deleted) {
      throw todoNotFoundException();
    }

    return true;
  }

  private normalizeOptionalDescription(
    description: string | undefined,
  ): string | undefined {
    if (description === undefined) {
      return undefined;
    }

    const normalized = description.trim();

    return normalized || undefined;
  }

  private normalizeNullableDescription(description: string): string | null {
    const normalized = description.trim();

    return normalized || null;
  }
}
