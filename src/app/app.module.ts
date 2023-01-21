import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { GraphqlModule } from '@/app/graphql/graphql.module';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: '.env', safe: true, parseLog: false }),
    GraphqlModule,
    LoggerModule,
  ],
})
export class AppModule {}
