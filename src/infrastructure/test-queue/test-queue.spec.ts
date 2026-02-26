import { Job } from 'bullmq';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createJobMock } from '../../../test/utils/mocks';
import { TestQueueProcessor } from './test-queue.processor';
import { TestQueueResolver } from './test-queue.resolver';

describe('TestQueueProcessor', () => {
  let processor: TestQueueProcessor;
  let mockJob: Job;

  const buildJob = (overrides?: Partial<Job>): Job => {
    const job = createJobMock();
    job.id = overrides?.id ?? '123';
    job.name = overrides?.name ?? 'test-job';
    job.data = overrides?.data ?? {
      message: 'test message',
      date: '2024-01-01T00:00:00.000Z',
    };
    return job;
  };

  beforeEach(() => {
    processor = new TestQueueProcessor();
    mockJob = buildJob();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('process', () => {
    it('should process job and return success result', async () => {
      const result = await processor.process(mockJob);

      expect(result).toEqual({ result: 'Success' });
    });

    it('should log start and finish messages', async () => {
      const logger = (
        processor as TestQueueProcessor & {
          logger: { log: (...args: unknown[]) => unknown };
        }
      )['logger'];
      const loggerSpy = vi.spyOn(logger, 'log');

      await processor.process(mockJob);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Start processing job ${mockJob.id} (${mockJob.name}). Data: ${JSON.stringify(mockJob.data)}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Finished processing job ${mockJob.id}`,
      );
    });

    it('should process job with different data', async () => {
      const customJob = buildJob({
        id: '456',
        name: 'custom-job',
        data: { message: 'custom message', date: '2024-02-01T00:00:00.000Z' },
      });

      const result = await processor.process(customJob);

      expect(result).toEqual({ result: 'Success' });
    });
  });
});

describe('TestQueueResolver', () => {
  let resolver: TestQueueResolver;

  const mockQueue = {
    add: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    resolver = new TestQueueResolver(mockQueue as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addTestJob', () => {
    it('should add job to queue and return true', async () => {
      const message = 'Hello World';

      const result = await resolver.addTestJob(message);

      expect(mockQueue.add).toHaveBeenCalledWith('test-job', {
        message,
        date: expect.any(String),
      });
      expect(result).toBe(true);
    });

    it('should add job with different messages', async () => {
      const message = 'Different message';

      await resolver.addTestJob(message);

      expect(mockQueue.add).toHaveBeenCalledWith('test-job', {
        message: 'Different message',
        date: expect.any(String),
      });
    });

    it('should add job with ISO date string in data', async () => {
      const message = 'test';

      await resolver.addTestJob(message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'test-job',
        expect.objectContaining({
          message,
          date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        }),
      );
    });

    it('should handle queue add failure', async () => {
      mockQueue.add.mockRejectedValue(new Error('Queue connection failed'));

      await expect(resolver.addTestJob('test')).rejects.toThrow(
        'Queue connection failed',
      );
    });
  });
});
