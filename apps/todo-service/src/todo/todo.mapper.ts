import type { TodoResponse } from '@app/grpc-contracts';

import type { Todo } from './todo.types';

export function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    userId: todo.userId,
    title: todo.title,
    description: todo.description ?? '',
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
