import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

export const RealIp = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    let request: FastifyRequest;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest<FastifyRequest>();
    } else {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }

    if (request.ip) {
      return request.ip;
    }

    const headers = request.headers || {};
    const xForwardedFor = headers['x-forwarded-for'];

    if (xForwardedFor) {
      return Array.isArray(xForwardedFor)
        ? xForwardedFor[0]!
        : xForwardedFor.split(',')[0]!;
    }

    return '127.0.0.1';
  },
);
