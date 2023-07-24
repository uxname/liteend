import { Module } from '@nestjs/common';

import { DebugResolver } from '@/app/debug/debug.resolver';

import { GitService } from './git/git.service';

@Module({
  providers: [DebugResolver, GitService],
  exports: [DebugResolver, GitService],
})
export class DebugModule {}
