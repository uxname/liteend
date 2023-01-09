import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { GraphqlModule } from '@/graphql/graphql.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: '.env', safe: true, parseLog: false }),
    GraphqlModule,
  ],
})
export class AppModule {}
