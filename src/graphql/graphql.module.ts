import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountModule } from '@/core/account/account.module';
import { QueryResolver } from './query/query.resolver';
import { MutationResolver } from './mutation/mutation.resolver';
import GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      resolvers: { JSON: GraphQLJSON },
    }),
    AccountModule,
  ],
  providers: [QueryResolver, MutationResolver],
})
export class GraphqlModule {}
