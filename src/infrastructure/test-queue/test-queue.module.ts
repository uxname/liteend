// src/app/test-queue/test-queue.module.ts
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TestQueueProcessor } from './test-queue.processor';
import { TestQueueResolver } from './test-queue.resolver';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test',
    }),
    BullBoardModule.forFeature({
      name: 'test',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [TestQueueProcessor, TestQueueResolver],
})
export class TestQueueModule {}
