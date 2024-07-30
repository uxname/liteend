import { Module } from '@nestjs/common';

import { AccountModule } from '@/app/account/account.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [PrismaModule, AccountModule],
  providers: [ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
