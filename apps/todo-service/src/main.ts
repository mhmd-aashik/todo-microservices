import { NestFactory } from '@nestjs/core';
import { TodoServiceModule } from './todo-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TODO_PACKAGE_NAME } from '@app/grpc-contracts';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TodoServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: TODO_PACKAGE_NAME,
        protoPath: join(process.cwd(), 'libs/grpc-contracts/proto/todo.proto'),
        url: '0.0.0.0:50051',
        loader: {
          keepCase: false,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
  );
  app.enableShutdownHooks();

  await app.listen();
}
void bootstrap();
