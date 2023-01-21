import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

import { GraphqlModule } from '@/graphql/graphql.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: '.env', safe: true, parseLog: false }),
    GraphqlModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env['NODE_ENV'] === 'production'
            ? undefined
            : { target: 'pino-pretty' },
      },
    }),
  ],
})
export class AppModule {}
