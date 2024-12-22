import 'source-map-support/register';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { Logger } from '@/common/logger/logger';

import packageJson from '../package.json';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global pipe setup for validation
  app.useGlobalPipes(new ValidationPipe());

  // Use custom body parser for text
  app.useBodyParser('text');

  const configService = app.get(ConfigService);
  app.enableShutdownHooks();

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(`${packageJson.name} REST API documentation`)
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  // Enable CORS
  app.enableCors();

  // Helmet for security headers
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

  // Compression middleware setup
  app.use(
    compression({
      level: -1, // Use default compression level
      threshold: 1024, // Compress responses larger than 1 KB
      filter: (request, response) => {
        if (request.headers['x-no-compression']) {
          return false; // Don't compress if the header is set
        }
        // eslint-disable-next-line unicorn/no-array-callback-reference,unicorn/no-array-method-this-argument
        return compression.filter(request, response);
      },
    }),
  );

  const port = configService.getOrThrow<number>('PORT');

  logger.log(`App started at http://localhost:${port}`);

  // Start server
  await app.listen(port);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch((error) => {
  const logger = new Logger('Main');
  logger.error('Application failed to start', error);
});
