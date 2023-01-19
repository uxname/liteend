import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/graphql/graphql.module';
import { Account } from '@/@generated/nestgraphql/account/account.model';

export const AccountDecorator = createParamDecorator<
  undefined,
  ExecutionContext,
  Promise<Account | undefined>
>(async (_, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context);
  return gqlContext.getContext<GqlContext>().account;
});
