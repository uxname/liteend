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
import { AuthModule } from './auth/auth.module';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';

// todo move to separated file
export class GqlContext {
  req: Request;
  res: Response;
  account: Account | undefined;
  accountSession: AccountSession | undefined;
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      resolvers: { JSON: GraphQLJSON },
      context: ({ req, res }): GqlContext => ({
        req,
        res,
        account: undefined,
        accountSession: undefined,
      }),
    }),
    PrismaModule,
    CryptoModule,
    AccountModule,
    AuthModule,
    AccountSessionModule,
    AuthModule,
    AccountSessionModule,
  ],
  providers: [QueryResolver, MutationResolver],
})
export class GraphqlModule {}
