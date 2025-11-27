import path from 'node:path';
import * as process from 'node:process';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { GraphQLError } from 'graphql/error';
import { getComplexity, simpleEstimator } from 'graphql-query-complexity';
import GraphQLJSON from 'graphql-type-json';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
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
        cache: true,

        validationRules: [
          (context) => ({
            OperationDefinition(node) {
              const schema = context.getSchema();
              const complexity = getComplexity({
                schema,
                operationName: node.name?.value,
                query: context.getDocument(),
                variables: undefined, // На этапе валидации переменные могут быть недоступны, используем дефолтные оценки
                estimators: [simpleEstimator({ defaultComplexity: 1 })],
              });

              const MAX_COMPLEXITY = 200; // Настрой под себя

              if (complexity > MAX_COMPLEXITY) {
                // Бросаем ошибку валидации
                context.reportError(
                  new GraphQLError(
                    `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}`,
                  ),
                );
              }
            },
          }),
        ],

        // Настройка Subscriptions (Mercurius Style)
        subscription: {
          // 1. Подключаем Redis Emitter (вместо локального PubSub)
          emitter: mqEmitterRedis({
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          }),

          // 2. Валидация при подключении (возвращает true/false)
          // Это не создает user, но проверяет наличие заголовка
          // verifyClient: (info, next) => {
          //   const headers = info.req.headers || {};
          //   const auth = headers.authorization || headers.Authorization;
          //   if (!auth) {
          //     return next(false); // Отклоняем соединение
          //   }
          //   next(true); // Разрешаем
          // },

          // 3. Передаем заголовки в контекст
          onConnect: (data) => {
            const payload = data.payload || data || {};
            const headers = payload.headers || payload || {};

            console.log('WS Connected with headers:', headers);

            // ВАЖНО: Мы сразу возвращаем структуру, которую ожидает Guard.
            // Guard ищет context.req.headers
            return {
              req: {
                headers: {
                  authorization: headers.Authorization || headers.authorization,
                },
              },
            };
          },
        },

        // Формирование контекста для Guard'ов
        // biome-ignore lint/suspicious/noExplicitAny: todo
        context: (request: any, reply: any) => {
          // 1. HTTP Запрос (Fastify)
          if (request.raw) {
            return { req: request, res: reply };
          }

          // 2. WebSocket (Mercurius)
          // ДЕБАГ: Смотрим, что же нам пришло
          console.log('DEBUG: WS Context Keys:', Object.keys(request));
          // if (request.context) console.log('DEBUG: request.context:', request.context);

          let headers = {};

          // Вариант А: Данные лежат в request.context (стандарт)
          if (request.context?.headers) {
            headers = request.context.headers;
          }
          // Вариант Б: Данные смержились в сам request
          else if (request.headers) {
            headers = request.headers;
          }
          // Вариант В: Данные в payload (иногда бывает)
          else if (request.payload?.headers) {
            headers = request.payload.headers;
          }

          // ГАРАНТИРУЕМ структуру, чтобы Passport не падал
          return {
            req: {
              headers: headers || {},
            },
          };
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
