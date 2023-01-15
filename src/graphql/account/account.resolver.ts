import { Query, Resolver } from '@nestjs/graphql';
import { AccountSession } from '@/graphql/account/types';

@Resolver()
export class AccountResolver {
  @Query(() => [AccountSession], { name: 'sessions' })
  sessions(): AccountSession[] {
    return [] as AccountSession[];
  }
}
