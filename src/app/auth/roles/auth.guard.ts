import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';

import { GqlContext } from '@/app/gql-context';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isWs = context.getType() === 'ws';
    if (isWs) {
      const { accountSession } = context.switchToWs().getClient().data;
      if (accountSession) {
        return true;
      } else {
        throw new WsException('Unauthorized');
      }
    }

    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getContext<GqlContext>().account) {
      return true;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
