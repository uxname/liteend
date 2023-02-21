import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { GraphqlModule } from '@/app/graphql/graphql.module';
import { Page404Filter } from '@/app/page-404/page-404.filter';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: '.env', safe: true, parseLog: false }),
    GraphqlModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: Page404Filter,
    },
  ],
})
export class AppModule {}
