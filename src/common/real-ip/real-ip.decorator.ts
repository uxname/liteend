import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RealIp = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }
    const xRealIp = request.headers['x-real-ip'];
    const xForwardedFor = request.headers['x-forwarded-for'];
    return xRealIp || xForwardedFor || request.connection.remoteAddress;
  },
);
