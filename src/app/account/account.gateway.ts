import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { AccountExtractorGuard } from '@/app/auth/account-extractor/account-extractor.guard';
import { AuthGuard } from '@/app/auth/roles/auth.guard';
import { Logger } from '@/common/logger/logger';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AccountExtractorGuard, AuthGuard)
export class AccountGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly logger: Logger) {}

  afterInit(server: Server): void {
    this.logger.log('AccountGateway initialized');
    this.server = server;
  }

  @SubscribeMessage('echo')
  async findAll(@MessageBody() text: string): Promise<WsResponse<string>> {
    this.logger.log(`Echo: ${text}`);
    // eslint-disable-next-line no-magic-numbers
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { event: 'echo', data: `You said: ${text}` };
  }
}
