import 'source-map-support/register';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { Logger } from '@/common/logger/logger';

import appInfo from '../app-info.json';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle(appInfo.name)
    .setDescription(`${appInfo.name} REST API documentation`)
    .setVersion(appInfo.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  const logger = new Logger('Main');
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

  const port = configService.getOrThrow<number>('PORT');
  if (!port) {
    throw new Error('No port specified');
  }
  logger.log(`App started at http://localhost:${port}`);

  app.listen(port).catch(console.error);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch(console.error);
