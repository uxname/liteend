import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserType {
  id: string;
  roles: string[];
  email?: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserType => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request) {
      const httpRequest = context.switchToHttp().getRequest();
      return httpRequest.user;
    }

    return request.user;
  },
);
