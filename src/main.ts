import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env['PORT'];
  if (!port) {
    throw new Error('No port specified');
  }
  console.log('port', port);
  await app.listen(port);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
