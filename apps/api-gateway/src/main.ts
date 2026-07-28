import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}

void bootstrap();
