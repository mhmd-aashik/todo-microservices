import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TodoModule } from '../../todo/todo.module';
import { GrpcToHttpInterceptor } from './grpc-to-http.interceptor';

@Module({
  imports: [TodoModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcToHttpInterceptor,
    },
  ],
})
export class ApiGatewayModule {}
