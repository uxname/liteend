import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => Query)
export class QueryResolver {
  constructor(private readonly logger: Logger) {}

  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    this.logger.log({ resolver: 'echo', text });
    return text;
  }

  @Query(() => GraphQLJSON, { name: 'debug' })
  debug(showAdditionalInfo = false): unknown {
    return {
      showAdditionalInfo,
    };
  }
}
