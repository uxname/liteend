import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';
import { BullBoardModule as BullBoard } from '@bull-board/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

@Module({
  imports: [
    BullBoard.forRoot({
      route: '/board',
      adapter: FastifyAdapter,
    }),
    BullBoard.forFeature({
      name: 'test',
      adapter: BullMQAdapter,
    }),
  ],
})
export class BullBoardModule implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const fastify = httpAdapter.getInstance<FastifyInstance>();

    const login = this.configService.get<string>('BULL_BOARD_LOGIN');
    const password = this.configService.get<string>('BULL_BOARD_PASSWORD');

    fastify.addHook(
      'onRequest',
      async (req: FastifyRequest, reply: FastifyReply) => {
        if (!req.url.startsWith('/board')) {
          return;
        }

        const unauthorized = () => {
          reply
            .code(401)
            .header('WWW-Authenticate', 'Basic realm="BullBoard"')
            .send('Unauthorized');
          return reply;
        };

        if (!login || !password) {
          return unauthorized();
        }

        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return unauthorized();
        }

        const [scheme, credentials] = authHeader.split(' ');

        if (scheme !== 'Basic' || !credentials) {
          return unauthorized();
        }

        const [user, pass] = Buffer.from(credentials, 'base64')
          .toString()
          .split(':');

        if (user !== login || pass !== password) {
          reply.code(403).send('Forbidden');
          return reply;
        }
      },
    );
  }
}
