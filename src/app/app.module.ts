import path from 'node:path';
import * as process from 'node:process';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';
import GraphQLJSON from 'graphql-type-json';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AccountModule } from '@/app/account/account.module';
import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { AuthModule } from '@/app/auth/auth.module';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RequestContextExtractorMiddleware } from '@/app/auth/request-context-extractor/request-context-extractor.middleware';
import { DebugModule } from '@/app/debug/debug.module';
import { EmailModule } from '@/app/email/email.module';
import { OneTimeCodeModule } from '@/app/one-time-code/one-time-code.module';
import { Page404Filter } from '@/app/page-404/page-404.filter';
import { ComplexityPlugin } from '@/common/complexity.plugin';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { DotenvValidatorModule } from '@/common/dotenv-validator/dotenv-validator.module';
import { HttpLoggerMiddleware } from '@/common/logger/http-logger-middleware';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaStudioModule } from '@/common/prisma-studio/prisma-studio.module';

import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      playground: true,
      introspection: true,
      persistedQueries: false,
      resolvers: { JSON: GraphQLJSON },
      context: ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }): RequestContext => ({
        req,
        res,
        account: undefined,
        profile: undefined,
        accountSession: undefined,
      }),
    }),
    AccountModule,
    AuthModule,
    AccountSessionModule,
    AuthModule,
    AccountSessionModule,
    CryptoModule,
    DebugModule,
    OneTimeCodeModule,
    EmailModule,
    LoggerModule,
    PrismaModule,
    PrismaStudioModule,
    LoggerServeModule,
    FileUploadModule,
    HealthModule,
    DotenvValidatorModule,
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
      useClass: Page404Filter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude({
        path: 'health',
        method: RequestMethod.ALL,
      })
      .forRoutes('*')
      .apply(RequestContextExtractorMiddleware)
      .exclude({
        path: 'health',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
