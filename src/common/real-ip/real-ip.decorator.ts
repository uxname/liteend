import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// RealIp decorator to retrieve the real IP address of the client
export const RealIp = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    let request: {
      headers: Record<string, string | string[]>;
      connection: { remoteAddress: string };
    };

    // Handle HTTP requests
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      // Handle GraphQL requests
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }

    // Get IP address from headers or fallback to connection.remoteAddress
    const xRealIp = request.headers['x-real-ip'] as string | undefined;
    const xForwardedFor = request.headers['x-forwarded-for'];

    // If x-forwarded-for is an array, use the first IP in the list
    const forwardedIp = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor;

    // Return the first valid IP address found, using nullish coalescing for better safety
    return xRealIp ?? forwardedIp ?? request.connection.remoteAddress;
  },
);
