import { Args, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

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
}
