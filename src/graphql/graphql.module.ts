import { Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountModule } from '@/graphql/account/account.module';
import { QueryResolver } from './query/query.resolver';
import { MutationResolver } from './mutation/mutation.resolver';
import GraphQLJSON from 'graphql-type-json';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AccountSessionModule } from './account-session/account-session.module';
import { CryptoModule } from '@/common/crypto/crypto.module';

export class GqlContext {
  req: Request;
  res: Response;
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      resolvers: { JSON: GraphQLJSON },
      context: ({ req, res }): GqlContext => ({ req, res }),
    }),
    PrismaModule,
    CryptoModule,
    AccountModule,
    AccountSessionModule,
  ],
  providers: [QueryResolver, MutationResolver],
})
export class GraphqlModule {}
