// src/app/test-queue/test-queue.module.ts
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TestQueueProcessor } from './test-queue.processor';
import { TestQueueResolver } from './test-queue.resolver';

@Module({
  imports: [
    // Регистрируем очередь в BullMQ
    BullModule.registerQueue({
      name: 'test',
    }),
    // Регистрируем эту очередь в админке Bull Board
    // Это позволяет не править общий модуль админки каждый раз
    BullBoardModule.forFeature({
      name: 'test',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [TestQueueProcessor, TestQueueResolver],
})
export class TestQueueModule {}
