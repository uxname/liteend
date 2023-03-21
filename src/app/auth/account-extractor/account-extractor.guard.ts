import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';

import { AccountSessionService } from '@/app/account-session/account-session.service';
import { GqlContext } from '@/app/gql-context';

@Injectable()
export class AccountExtractorGuard implements CanActivate {
  constructor(private readonly accountSessionService?: AccountSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const isWs = context.getType() === 'ws';
    if (isWs) {
      const wsContext = context.switchToWs();
      const client = wsContext.getClient();
      const accessToken = client.handshake.auth.authorization;
      if (accessToken) {
        const account = await this.accountSessionService?.getAccountByToken(
          accessToken,
        );

        const accountSession =
          await this.accountSessionService?.getAccountSessionByToken(
            accessToken,
          );

        wsContext.getClient().data = {
          ...wsContext.getClient().data,
          account,
          accountSession,
        };

        return true;
      } else {
        throw new WsException('Unauthorized');
      }
    }
    const token = gqlContext.getContext<GqlContext>().req.headers.authorization;
    if (!token) {
      return true;
    }
    gqlContext.getContext<GqlContext>().account =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.accountSessionService!.getAccountByToken(token);

    gqlContext.getContext<GqlContext>().accountSession =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.accountSessionService!.getAccountSessionByToken(token);

    return true;
  }
}
