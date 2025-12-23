import path from 'node:path';
import * as process from 'node:process';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GraphQLError } from 'graphql/error';
import { getComplexity, simpleEstimator } from 'graphql-query-complexity';
import GraphQLJSON from 'graphql-type-json';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { AppController } from '@/app/app.controller';
import { DebugModule } from '@/app/debug/debug.module';
import { FileUploadModule } from '@/app/file-upload/file-upload.module';
import { HealthModule } from '@/app/health/health.module';
import { ProfileModule } from '@/app/profile/profile.module';
import { TestQueueModule } from '@/app/test-queue/test-queue.module';
import { AllExceptionsFilter } from '@/common/all-exceptions-filter';
import { AuthModule } from '@/common/auth/auth.module';
import { BullBoardModule } from '@/common/bull-board/bull-board.module';
import { DotenvValidatorModule } from '@/common/dotenv-validator/dotenv-validator.module';
import { gqlErrorFormatter } from '@/common/graphql/error-formatter';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaStudioModule } from '@/common/prisma-studio/prisma-studio.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mqEmitterRedis = require('mqemitter-redis');

@Module({
  imports: [
    AuthModule,
    TestQueueModule,
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        graphiql: false,
        jit: 1,
        cache: false,

        validationRules: ({ variables }) => [
          (context) => ({
            OperationDefinition(node) {
              const schema = context.getSchema();
              const complexity = getComplexity({
                schema,
                operationName: node.name?.value,
                query: context.getDocument(),
                variables: variables,
                estimators: [simpleEstimator({ defaultComplexity: 1 })],
              });

              const MAX_COMPLEXITY = 1000;

              if (complexity > MAX_COMPLEXITY) {
                context.reportError(
                  new GraphQLError(
                    `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}`,
                  ),
                );
              }
            },
          }),
        ],

        subscription: {
          emitter: mqEmitterRedis({
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          }),
          onConnect: (data) => {
            const payload = data.payload || data || {};
            const headers = payload.headers || payload || {};

            return {
              req: {
                headers: {
                  authorization: headers.Authorization || headers.authorization,
                },
              },
            };
          },
        },

        context: (request: FastifyRequest, reply: FastifyReply) => {
          return { req: request, res: reply };
        },

        resolvers: { JSON: GraphQLJSON },
        errorFormatter: gqlErrorFormatter,
      }),
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
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
