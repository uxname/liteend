import { Module } from '@nestjs/common';

import { PrismaModule } from '@/common/prisma/prisma.module';
import { EmailModule } from '@/graphql/email/email.module';

import { OneTimeCodeService } from './one-time-code.service';

@Module({
  imports: [EmailModule, PrismaModule],
  providers: [OneTimeCodeService],
  exports: [OneTimeCodeService],
})
export class OneTimeCodeModule {}
