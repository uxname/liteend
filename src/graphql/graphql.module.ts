import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from '@/core/user/user.module';
import { QueryResolver } from './query/query.resolver';
import { MutationResolver } from './mutation/mutation.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
    }),
    UserModule,
  ],
  providers: [QueryResolver, MutationResolver],
})
export class GraphqlModule {}
