import { Plugin } from '@nestjs/apollo';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

import { Logger } from '@/common/logger/logger';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(ComplexityPlugin.name);
  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener> {
    const MAX_COMPLEXITY = 200;
    const { schema } = this.gqlSchemaHost;

    const thisLogger = this.logger;
    return {
      async didResolveOperation({ request, document }): Promise<void> {
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
        if (complexity > MAX_COMPLEXITY) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}`,
          );
        }
        // eslint-disable-next-line no-magic-numbers
        if (complexity > MAX_COMPLEXITY / 2) {
          thisLogger.warn(`Query complexity: ${complexity}`);
        }
      },
    };
  }
}
