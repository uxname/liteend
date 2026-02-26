import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import multiPart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AltairFastify } from 'altair-fastify-plugin';
import { Logger } from 'nestjs-pino';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import packageJson from '../../package.json';

export async function setupApp(
  app: NestFastifyApplication,
): Promise<NestFastifyApplication> {
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ZodValidationPipe());

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
    max: 100,
    timeWindow: '1 minute',
    allowList: (request) => {
      const url = request.url;
      return url.startsWith('/studio') || url.startsWith('/board');
    },
  });

  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    threshold: 1024,
  });

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(`${packageJson.name} REST API documentation`)
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, cleanupOpenApiDoc(document));

  app.enableCors();

  return app;
}
