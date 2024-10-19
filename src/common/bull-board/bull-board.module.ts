import process from 'node:process';

import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule as BullBoard } from '@bull-board/nestjs';
import { HttpStatus, Module } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Module({
  imports: [
    BullBoard.forRoot({
      route: '/board',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
      middleware: (
        request: Request,
        response: Response,
        next: NextFunction,
      ) => {
        const login = process.env.BULL_BOARD_LOGIN;
        const password = process.env.BULL_BOARD_PASSWORD;

        const b64auth =
          (request.headers.authorization ?? '').split(' ')[1] ?? '';
        const [loginBase64, passwordBase64] = Buffer.from(b64auth, 'base64')
          .toString()
          .split(':');

        if (
          loginBase64 &&
          passwordBase64 &&
          loginBase64 === login &&
          passwordBase64 === password
        ) {
          return next();
        }

        response.set('WWW-Authenticate', 'Basic realm="401"');
        response
          .status(HttpStatus.UNAUTHORIZED)
          .send('Authentication required.');

        return response
          .status(HttpStatus.UNAUTHORIZED)
          .send('Authentication required.');
      },
    }),
    BullBoard.forFeature({
      name: 'email',
      adapter: BullAdapter,
    }),
    BullBoard.forFeature({
      name: 'account-session',
      adapter: BullAdapter,
    }),
    BullBoard.forFeature({
      name: 'one-time-code',
      adapter: BullAdapter,
    }),
  ],
})
export class BullBoardModule {}
