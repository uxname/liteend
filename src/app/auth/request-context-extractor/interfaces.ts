import { Request, Response } from 'express';
import { Account } from '@/app/account/types/account.object-type';
import { AccountSession } from '@/app/account-session/types/account-session.object-type';
import { Profile } from '@/app/profile/types/profile.object-type';

export class RequestContext {
  req: Request;
  res?: Response;
  account: Account | undefined;
  profile: Profile | undefined;
  accountSession: AccountSession | undefined;
}
