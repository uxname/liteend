import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => Query)
export class QueryResolver {
  private readonly logger = new Logger(QueryResolver.name);

  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    this.logger.log(`echo: ${text}`);
    return text;
  }

  @Query(() => GraphQLJSON, { name: 'debug' })
  debug(showAdditionalInfo = false): unknown {
    return {
      showAdditionalInfo,
    };
  }
}
