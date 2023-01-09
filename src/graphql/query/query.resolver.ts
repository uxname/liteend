import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Query)
export class QueryResolver {
  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }
}
