import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';

@Module({
  providers: [AccountService, AccountResolver],
})
export class AccountModule {}
