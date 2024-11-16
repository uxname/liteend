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
  private server: Server;

  private clients: Map<number, Set<Socket>> = new Map();
  private readonly logger = new Logger(AccountGateway.name);

  constructor(private readonly accountSessionService: AccountSessionService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const authorization = client.handshake.auth.authorization;
      if (!authorization) return;

      const accountSession =
        await this.accountSessionService.getAccountSessionByToken(
          authorization,
        );
      if (!accountSession) return;

      const account = await this.accountSessionService.getAccount(
        accountSession.id,
      );
      if (!account) return;

      const clients = this.clients.get(account.id) || new Set<Socket>();
      clients.add(client);
      this.clients.set(account.id, clients);
    } catch (error) {
      this.logger.error('Error during handleConnection', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    for (const [accountId, clients] of this.clients.entries()) {
      if (clients.delete(client) && clients.size === 0) {
        this.clients.delete(accountId);
      }
    }
  }

  afterInit(): void {
    this.logger.log('AccountGateway initialized');
  }

  async sendToAccount(
    accountId: number,
    event: string,
    data: unknown,
  ): Promise<void> {
    const clients = this.clients.get(accountId);
    if (!clients) return;

    for (const client of clients) {
      client.emit(event, data);
    }
  }

  @SubscribeMessage('echo')
  async handleEcho(@MessageBody() text: string): Promise<WsResponse<string>> {
    this.logger.log(`Echo: ${text}`);
    return { event: 'echo', data: `You said: ${text}` };
  }
}
