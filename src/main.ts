import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have decorators
      forbidNonWhitelisted: true, // Throws error if unknown values are present
      transform: true, // Transforms input to DTO types (optional but useful)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
