import { Module } from '@nestjs/common';
import { AccountSessionService } from './account-session.service';

@Module({
  providers: [AccountSessionService],
  exports: [AccountSessionService],
})
export class AccountSessionModule {}
