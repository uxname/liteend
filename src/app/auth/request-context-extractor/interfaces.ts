import { Request, Response } from 'express';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { Profile } from '@/@generated/nestgraphql/profile/profile.model';

export class RequestContext {
  req: Request;
  res?: Response;
  account: Account | undefined;
  profile: Profile | undefined;
  accountSession: AccountSession | undefined;
}
