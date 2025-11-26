import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import multiPart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AltairFastify } from 'altair-fastify-plugin';
import { Logger } from 'nestjs-pino';
import packageJson from '../package.json';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({
    logger: false,
    bodyLimit: 10485760,
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  await app.register(multiPart);

  await app.register(AltairFastify, {
    path: '/altair',
    baseURL: '/altair/',
    endpointURL: '/graphql',
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  });

  await app.register(rateLimit, {
    max: 100, // 100 запросов
    timeWindow: '1 minute', // в минуту с одного IP
  });

  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    threshold: 1024,
  });

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

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`App started at http://localhost:${port}`);
  logger.log(`GraphiQL at http://localhost:${port}/graphiql`);
  logger.log(`Altair at http://localhost:${port}/altair`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start', error);
});
