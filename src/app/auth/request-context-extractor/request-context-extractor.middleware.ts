import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class RequestContextExtractorMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(
    request: Request & { requestContext: RequestContext },
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = request.headers.authorization;

    const requestContext: RequestContext = {
      req: request,
      res: response,
      account: undefined,
      profile: undefined,
      accountSession: undefined,
    };

    // Extract session data if a token is provided
    if (token) {
      const session = await this.prisma.accountSession.findUnique({
        where: { token },
        include: { account: { include: { profile: true } } },
      });

      if (session) {
        requestContext.account = session.account;
        requestContext.profile = session.account.profile ?? undefined;
        requestContext.accountSession = session;
      }
    }

    request.requestContext = requestContext;
    next();
  }
}
