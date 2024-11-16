import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { Logger } from '@/common/logger/logger';

const logger = new Logger('RequestContextDecorator');

export const RequestContextDecorator = createParamDecorator(
  (_, context: ExecutionContext): RequestContext | undefined => {
    const gqlContext = GqlExecutionContext.create(context);
    const requestContext = gqlContext.getContext().req.requestContext;

    if (!requestContext) {
      // Optionally log if the context is missing
      logger.warn('RequestContext is missing');
    }

    return requestContext;
  },
);
