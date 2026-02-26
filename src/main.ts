import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';

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

  await setupApp(app);

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`App started at http://localhost:${port}`);
  logger.log(`Altair at http://localhost:${port}/altair`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start', error);
});
