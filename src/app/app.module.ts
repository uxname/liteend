import path from 'node:path';
import * as process from 'node:process';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { DebugModule } from '@/app/debug/debug.module';
import {
  AllExceptionsFilter,
  createDigestFromError,
} from '@/common/all-exceptions-filter';
import { AuthModule } from '@/common/auth/auth.module';
import { BullBoardModule } from '@/common/bull-board/bull-board.module';
import { ComplexityPlugin } from '@/common/complexity.plugin';
import { DotenvValidatorModule } from '@/common/dotenv-validator/dotenv-validator.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaStudioModule } from '@/common/prisma-studio/prisma-studio.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { TestQueueModule } from './test-queue/test-queue.module';

const logger = new Logger('AppModule');

interface ContextArgs {
  req?: Request;
  extra?: {
    connectionParams?: Record<string, unknown>;
  };
}

interface OnConnectArgs {
  connectionParams?: Record<string, unknown>;
  extra: unknown;
}

interface GraphQLExecutionContext {
  req?: Request;
  connectionParams?: Record<string, unknown>;
}

@Module({
  imports: [
    AuthModule,
    TestQueueModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: OnConnectArgs) => {
            const { connectionParams, extra } = context;
            const enhancedExtra = extra as {
              connectionParams?: Record<string, unknown>;
            };
            enhancedExtra.connectionParams = connectionParams;
            return { extra: enhancedExtra };
          },
        },
      },
      context: ({ req, extra }: ContextArgs) => {
        const context: GraphQLExecutionContext = {};
        if (req) context.req = req;
        if (extra?.connectionParams)
          context.connectionParams = extra.connectionParams;
        return context;
      },
      autoSchemaFile: true,
      path: '/graphql',
      graphiql: true,
      playground: {
        settings: {
          'editor.theme': 'light',
        },
      },
      introspection: true,
      persistedQueries: false,
      resolvers: { JSON: GraphQLJSON },
      formatError: (error) => {
        const digest = createDigestFromError(error);
        const errorWithDigest = { ...error, digest };
        logger.error(errorWithDigest);
        return errorWithDigest;
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
    ComplexityPlugin,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
