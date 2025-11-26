import path from 'node:path';
import * as process from 'node:process';
import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import GraphQLJSON from 'graphql-type-json';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { DebugModule } from '@/app/debug/debug.module';
import { FileUploadModule } from '@/app/file-upload/file-upload.module';
import { HealthModule } from '@/app/health/health.module';
import { ProfileModule } from '@/app/profile/profile.module';
import { TestQueueModule } from '@/app/test-queue/test-queue.module';
import {
  AllExceptionsFilter,
  createDigestFromError,
} from '@/common/all-exceptions-filter';
import { AuthModule } from '@/common/auth/auth.module';
import { BullBoardModule } from '@/common/bull-board/bull-board.module';
import { DotenvValidatorModule } from '@/common/dotenv-validator/dotenv-validator.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaStudioModule } from '@/common/prisma-studio/prisma-studio.module';

const logger = new Logger('AppModule');

@Module({
  imports: [
    AuthModule,
    TestQueueModule,
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      graphiql: false,
      subscription: true,
      resolvers: { JSON: GraphQLJSON },
      errorFormatter: (execution) => {
        const [error] = execution.errors;
        const originalError = error?.originalError || error;
        const digest = createDigestFromError(originalError);

        logger.error({ ...originalError, digest });

        return {
          statusCode: 500,
          response: {
            errors: execution.errors.map((e) => ({
              message: e.message,
              extensions: { digest, ...e.extensions },
            })),
            data: execution.data,
          },
        };
      },
    }),
    BullBoardModule,
    DebugModule,
    LoggerModule,
    PrismaModule,
    PrismaStudioModule,
    LoggerServeModule,
    FileUploadModule,
    HealthModule,
    DotenvValidatorModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: Number.parseInt(
            configService.getOrThrow<string>('REDIS_PORT'),
            10,
          ),
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
      logging: true,
      typesOutputPath: path.join(
        process.cwd(),
        'src',
        '@generated',
        'i18n-types.ts',
      ),
    }),
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
