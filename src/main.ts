import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.useLogger(logger);
  logger.log('Starting application...');
  const port = process.env['PORT'];
  if (!port) {
    throw new Error('No port specified');
  }
  console.log(`App started at http://localhost:${port}`);
  await app.listen(port);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch(console.error);
