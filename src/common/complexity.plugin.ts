import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import type { BaseContext } from '@apollo/server/src/externalTypes/context';
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(ComplexityPlugin.name);

  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
    const MAX_COMPLEXITY = 700; // Define the max complexity
    const { schema } = this.gqlSchemaHost;

    const thisLogger = this.logger;

    return {
      async didResolveOperation({ request, document }): Promise<void> {
        // Calculate the complexity of the query
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        // If the complexity exceeds the limit, throw an error
        if (complexity > MAX_COMPLEXITY) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}`,
          );
        }

        // Log a warning if the complexity exceeds half of the max limit
        if (complexity > MAX_COMPLEXITY / 2) {
          thisLogger.warn(`Query complexity: ${complexity}`);
        }
      },
    };
  }
}
