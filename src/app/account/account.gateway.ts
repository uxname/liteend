import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AccountSessionService } from '@/app/account-session/account-session.service';
import { Logger } from '@/common/logger/logger';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AccountGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // account id -> clients
  clients: Map<number, Set<Socket>> = new Map();
  private readonly logger = new Logger(AccountGateway.name);

  constructor(private readonly accountSessionService: AccountSessionService) {}

  async handleConnection(client: Socket): Promise<void> {
    const authorization = client.handshake.auth.authorization;
    if (authorization) {
      const accountSession =
        await this.accountSessionService.getAccountSessionByToken(
          authorization,
        );
      if (accountSession) {
        const account = await this.accountSessionService.getAccount(
          accountSession,
        );
        const clients = this.clients.get(account.id);
        if (clients) {
          clients.add(client);
        } else {
          this.clients.set(account.id, new Set([client]));
        }
      }
    }
  }

  handleDisconnect(client: Socket): void {
    for (const [account, clients] of this.clients.entries()) {
      if (clients.has(client)) {
        clients.delete(client);
        if (clients.size === 0) {
          this.clients.delete(account);
        }
      }
    }
  }

  afterInit(server: Server): void {
    this.logger.log('AccountGateway initialized');
    this.server = server;
  }

  public async sendToAccount(
    accountId: number,
    event: string,
    data: unknown,
  ): Promise<void> {
    const clients = this.clients.get(accountId);
    if (clients) {
      for (const client of clients) {
        client.emit(event, data);
      }
    }
  }

  @SubscribeMessage('echo')
  async findAll(@MessageBody() text: string): Promise<WsResponse<string>> {
    this.logger.log(`Echo: ${text}`);
    return { event: 'echo', data: `You said: ${text}` };
  }
}
