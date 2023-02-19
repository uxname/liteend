import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';
import GraphQLJSON from 'graphql-type-json';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { AccountModule } from '@/app/graphql/account/account.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountSessionModule } from './account-session/account-session.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { MutationResolver } from './mutation/mutation.resolver';
import { OneTimeCodeModule } from './one-time-code/one-time-code.module';
import { OneTimeCodeService } from './one-time-code/one-time-code.service';
import { QueryResolver } from './query/query.resolver';

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
      playground: true,
      introspection: true,
      persistedQueries: false,
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
    OneTimeCodeModule,
    EmailModule,
  ],
  providers: [QueryResolver, MutationResolver, OneTimeCodeService],
})
export class GraphqlModule {}
