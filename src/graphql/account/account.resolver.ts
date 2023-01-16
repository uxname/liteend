import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AccountResolver {
  @Query(() => [AccountSession], { name: 'sessions' })
  sessions(): AccountSession[] {
    return [] as AccountSession[];
  }
}
