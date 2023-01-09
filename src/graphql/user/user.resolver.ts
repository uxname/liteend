import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello world';
  }
}
