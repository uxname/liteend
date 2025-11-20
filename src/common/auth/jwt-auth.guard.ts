import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // 1. HTTP REST
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();

    // 2. WebSocket
    if (gqlContext.connectionParams) {
      const token =
        gqlContext.connectionParams.Authorization ||
        gqlContext.connectionParams.authorization;

      // WebSockets do not have a standard Request object like HTTP.
      // We create an adapter object with headers so Passport can validate the token.
      const adaptedRequest = {
        headers: {
          authorization: token,
        },
      };

      // ATTACHMENT: We must attach this adapter to the context.
      // Passport will validate the token and assign the 'user' property to this object.
      // By attaching it to gqlContext.req, we ensure resolvers can access context.req.user.
      gqlContext.req = adaptedRequest;

      return adaptedRequest;
    }

    // 3. HTTP GraphQL
    if (gqlContext.req) {
      return gqlContext.req;
    }

    throw new UnauthorizedException('Cannot determine request context');
  }
}
