import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  users(): string {
    return 'user: 1,2,3,4...';
  }
}
