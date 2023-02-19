import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { Logger } from '@/common/logger/logger';

import { AppModule } from './app/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          // eslint-disable-next-line quotes
          'img-src': ["'self'", 'data:', 'cdn.jsdelivr.net'], // for graphql playground
          // eslint-disable-next-line quotes
          'script-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"], // for graphql playground
        },
      },
    }),
  );
  const logger = app.get(Logger);
  app.useLogger(logger);

  const port = process.env.PORT;
  if (!port) {
    throw new Error('No port specified');
  }
  logger.log(`App started at http://localhost:${port}`);
  await app.listen(port);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch(console.error);
