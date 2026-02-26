import { Module } from '@nestjs/common';

import { DebugResolver } from './debug.resolver';

@Module({
  providers: [DebugResolver],
  exports: [DebugResolver],
})
export class DebugModule {}
