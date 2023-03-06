import * as process from 'node:process';

import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { Logger } from '@/common/logger/logger';
import { sendStatistic } from '@/common/telemetry';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(
    compression({
      level: -1, // https://github.com/expressjs/compression#level
      threshold: 1024, // in bytes
      filter: (request, response) => {
        if (request.headers['x-no-compression']) {
          return false;
        }
        // eslint-disable-next-line unicorn/no-array-callback-reference,unicorn/no-array-method-this-argument
        return compression.filter(request, response);
      },
    }),
  );

  const port = Number(process.env.PORT);
  if (!port) {
    throw new Error('No port specified');
  }
  logger.log(`App started at http://localhost:${port}`);

  app.listen(port).then(sendStatistic).catch(console.error);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch(console.error);
