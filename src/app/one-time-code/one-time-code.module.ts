import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { EmailModule } from '@/app/email/email.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { OneTimeCodeService } from './one-time-code.service';

@Module({
  imports: [
    EmailModule,
    PrismaModule,
    BullModule.registerQueue({
      name: 'one-time-code',
    }),
  ],
  providers: [OneTimeCodeService],
  exports: [OneTimeCodeService],
})
export class OneTimeCodeModule {}
