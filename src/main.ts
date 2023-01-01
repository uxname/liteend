import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 3000;
  await app.listen(PORT);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
