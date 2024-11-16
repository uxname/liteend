import { Request, Response } from 'express';

import { Account } from '@/app/account/types';
import { AccountSession } from '@/app/account-session/types';
import { Profile } from '@/app/profile/types';

export class RequestContext {
  req: Request;
  res?: Response;
  account: Account | undefined;
  profile: Profile | undefined;
  accountSession: AccountSession | undefined;
}
