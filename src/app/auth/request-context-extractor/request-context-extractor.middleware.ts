import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class RequestContextExtractorMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async use(request: Request | any, response: Response, next: NextFunction) {
    const token = request.headers.authorization;

    const requestContext: RequestContext = {
      req: request,
      res: response,
      account: undefined,
      accountSession: undefined,
    };

    if (token) {
      const session = await this.prisma.accountSession.findUnique({
        where: {
          token,
        },
        include: { account: true },
      });

      if (session) {
        requestContext.account = session.account;
        requestContext.accountSession = session;
      }
    }

    request.requestContext = requestContext;
    next();
  }
}
