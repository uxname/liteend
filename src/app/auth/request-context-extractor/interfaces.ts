import { Request, Response } from 'express';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';

export class RequestContext {
  req: Request;
  res?: Response;
  account: Account | undefined;
  accountSession: AccountSession | undefined;
}
