import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import { GrpcToHttpInterceptor } from './common/grpc/grpc-to-http.interceptor';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/api-gateway/.env'),
    }),
    AuthModule,
    TodoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcToHttpInterceptor,
    },
  ],
})
export class ApiGatewayModule {}
