import { getQueueToken } from '@nestjs/bullmq';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { Job, Queue } from 'bullmq';
import { beforeAll, describe, expect, it } from 'vitest';
import { createTestingApp } from './utils/testing-app';

describe('BullMQ Queue (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const result = await createTestingApp();
    app = result.app;
  });

  it('should successfully process a job through Redis', async () => {
    const testQueue = app.get<Queue>(getQueueToken('test'));
    const job = await testQueue.add('test-job', {
      message: 'integration test message',
      date: new Date().toISOString(),
    });

    // Wait for job completion via polling
    const startTime = Date.now();
    const timeout = 8000;
    let completedJob: Job | null = null;

    while (Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const current = await testQueue.getJob(job.id!);
      if (!current) continue;
      const state = await current.getState();
      if (state === 'completed') {
        completedJob = current;
        break;
      }
      if (state === 'failed') {
        throw new Error(`Job failed: ${current.failedReason}`);
      }
    }

    expect(completedJob).not.toBeNull();
    expect(completedJob!.returnvalue).toEqual({ result: 'Success' });
  }, 10000);
});
