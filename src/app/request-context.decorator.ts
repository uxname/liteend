import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';

export const RequestContextDecorator = createParamDecorator<
  undefined,
  ExecutionContext,
  Promise<RequestContext | undefined>
>(async (_, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  return gqlContext.getContext().req.requestContext;
});
