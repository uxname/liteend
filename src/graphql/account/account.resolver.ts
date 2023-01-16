import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Account } from '@/@generated/nestgraphql/account/account.model';

@Resolver()
export class AccountResolver {
  @Query(() => [AccountSession], { name: 'sessions' })
  sessions(): AccountSession[] {
    return [] as AccountSession[];
  }

  @Query(() => GraphQLJSON, { name: 'whoami' })
  whoami(): Account {
    return {} as Account;
  }

  @Query(() => AccountSession, { name: 'currentSession' })
  currentSession(): AccountSession {
    return {} as AccountSession;
  }
}
