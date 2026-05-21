import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { BODY_LIMIT } from '@/common/constants';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED_REJECTION — process exiting', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT_EXCEPTION — process exiting', error);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({
    logger: false,
    bodyLimit: BODY_LIMIT,
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  await setupApp(app);

  const configService = app.get(ConfigService);

  app.enableVersioning();

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`App started at http://localhost:${port}`);
  logger.log(`Altair at http://localhost:${port}/altair`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start', error);
});
