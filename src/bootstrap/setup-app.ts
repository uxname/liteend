import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import multiPart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AltairFastify } from 'altair-fastify-plugin';
import { Logger } from 'nestjs-pino';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import {
  COMPRESSION_THRESHOLD,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
} from '@/common/constants';
import packageJson from '../../package.json';

export async function setupApp(
  app: NestFastifyApplication,
): Promise<NestFastifyApplication> {
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ZodValidationPipe());

  await app.register(multiPart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 10,
    },
  });

  await app.register(AltairFastify, {
    path: '/altair',
    baseURL: '/altair/',
    endpointURL: '/graphql',
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        scriptSrc: [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        connectSrc: [`'self'`],
        fontSrc: [`'self'`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: null,
        scriptSrcAttr: null,
      },
    },
  });

  await app.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: RATE_LIMIT_WINDOW,
    allowList: (request) => {
      const url = request.url;
      return url.startsWith('/studio') || url.startsWith('/board');
    },
    keyGenerator: (request) => {
      const url = request.url;
      if (url === '/upload' || url.startsWith('/graphql')) {
        const ip = request.ip;
        return `auth:${ip}`;
      }
      return request.ip;
    },
  });

  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    threshold: COMPRESSION_THRESHOLD,
  });

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(`${packageJson.name} REST API documentation`)
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, cleanupOpenApiDoc(document), {
    swaggerUrl: '/swagger-json',
  });

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4000';
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  return app;
}
