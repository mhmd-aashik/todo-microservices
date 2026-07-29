import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import type { Todo } from './todo.types';

export interface CreateTodoRecord {
  userId: string;
  title: string;
  description?: string;
}

export interface UpdateTodoRecord {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTodoRecord): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
      },
    });
  }

  findAllByUserId(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOneByUserId(userId: string, todoId: string): Promise<Todo | null> {
    return this.prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });
  }

  async updateByUserId(
    userId: string,
    todoId: string,
    data: UpdateTodoRecord,
  ): Promise<Todo | null> {
    const result = await this.prisma.todo.updateMany({
      where: {
        id: todoId,
        userId,
      },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    });
  }

  async deleteByUserId(userId: string, todoId: string): Promise<boolean> {
    const result = await this.prisma.todo.deleteMany({
      where: {
        id: todoId,
        userId,
      },
    });

    return result.count > 0;
  }
}
