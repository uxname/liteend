import { Module } from '@nestjs/common';

import { TotpService } from '@/app/auth/totp/totp.service';

@Module({
  providers: [TotpService],
  exports: [TotpService],
})
export class TotpModule {}
