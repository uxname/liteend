import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from '@/app/graphql/graphql.module';

export const ContextDecorator = createParamDecorator<
  undefined,
  ExecutionContext,
  Promise<GqlContext | undefined>
>(async (_, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  return gqlContext.getContext<GqlContext>();
});
