import { Args, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Account, AccountSession } from '@/graphql/account/types';

@Resolver(() => Query)
export class QueryResolver {
  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }

  @Query(() => GraphQLJSON, { name: 'debug' })
  debug(showAdditionalInfo = false): unknown {
    return {
      showAdditionalInfo,
    };
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
