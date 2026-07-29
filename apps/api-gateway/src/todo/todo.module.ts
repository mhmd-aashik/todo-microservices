import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TODO_PACKAGE_NAME } from '@app/grpc-contracts';

import { TODO_GRPC_CLIENT } from './todo.constants';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TODO_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: TODO_PACKAGE_NAME,
          protoPath: join(
            process.cwd(),
            'libs/grpc-contracts/proto/todo.proto',
          ),
          url: 'localhost:50051',
          loader: {
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
          },
        },
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
