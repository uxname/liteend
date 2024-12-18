import { Module } from '@nestjs/common';

import { DebugResolver } from '@/app/debug/debug.resolver';

@Module({
  imports: [],
  providers: [DebugResolver],
  exports: [DebugResolver],
})
export class DebugModule {}
