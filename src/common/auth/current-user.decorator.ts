import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Profile } from '@prisma/client';

export type CurrentUserType = Profile;

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
