import { Module } from '@nestjs/common';

import { PrismaModule } from '@/common/prisma/prisma.module';
import { PubSubModule } from '@/common/pubsub/pubsub.module';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
