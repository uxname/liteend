---
name: add-queue-job
description: Add a new BullMQ job queue to the liteend project — processor, producer injection, module registration, Bull Board integration, and unit tests.
---

The user wants to add a new BullMQ job queue to the liteend project. They will provide the queue name and describe what the job should do.

## Project BullMQ setup

- Package: `@nestjs/bullmq` (NestJS wrapper) + `bullmq`
- Redis connection is configured globally in `BullModule.forRootAsync` in `app.module.ts`
- Bull Board is integrated via `@bull-board/nestjs` — each queue must register itself there
- Reference implementation: `src/infrastructure/test-queue/`

## Files to create

```
src/infrastructure/<queue-name>/
  <queue-name>.module.ts
  <queue-name>.processor.ts
  <queue-name>.service.ts    (producer — injectable into other modules)
  <queue-name>.spec.ts
```

If the queue is tightly coupled to a business module, place it in `src/modules/<module>/` instead.

## File templates

### `<queue-name>.processor.ts`
```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export interface <QueueName>JobData {
  // define typed job payload here
}

@Processor('<queue-name>')
export class <QueueName>Processor extends WorkerHost {
  private readonly logger = new Logger(<QueueName>Processor.name);

  async process(job: Job<<QueueName>JobData>): Promise<unknown> {
    this.logger.log(`Processing job ${job.id} (${job.name})`);

    // job logic here

    this.logger.log(`Finished job ${job.id}`);
    return { result: 'Success' };
  }
}
```

### `<queue-name>.service.ts` (producer)
```typescript
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { <QueueName>JobData } from './<queue-name>.processor';

@Injectable()
export class <QueueName>Service {
  constructor(
    @InjectQueue('<queue-name>') private readonly queue: Queue,
  ) {}

  async add<JobName>(data: <QueueName>JobData): Promise<void> {
    await this.queue.add('<job-name>', data);
  }
}
```

### `<queue-name>.module.ts`
```typescript
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { <QueueName>Processor } from './<queue-name>.processor';
import { <QueueName>Service } from './<queue-name>.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: '<queue-name>',
    }),
    BullBoardModule.forFeature({
      name: '<queue-name>',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [<QueueName>Processor, <QueueName>Service],
  exports: [<QueueName>Service],
})
export class <QueueName>Module {}
```

### `<queue-name>.spec.ts`
```typescript
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createJobMock } from '../../../test/utils/mocks';
import { <QueueName>Processor } from './<queue-name>.processor';
import { <QueueName>Service } from './<queue-name>.service';

describe('<QueueName>Processor', () => {
  let processor: <QueueName>Processor;

  const buildJob = (data?: Partial<Job>): Job => {
    const job = createJobMock();
    job.id = data?.id ?? '1';
    job.name = data?.name ?? '<job-name>';
    job.data = data?.data ?? { /* default test data */ };
    return job;
  };

  beforeEach(() => {
    processor = new <QueueName>Processor();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should process job and return success', async () => {
    const result = await processor.process(buildJob());
    expect(result).toEqual({ result: 'Success' });
  });

  it('should log start and finish', async () => {
    const logSpy = vi.spyOn(Logger.prototype, 'log');
    const job = buildJob();
    await processor.process(job);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(String(job.id)));
  });
});

describe('<QueueName>Service', () => {
  let service: <QueueName>Service;

  const mockQueue = {
    add: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    service = new <QueueName>Service(mockQueue as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add job to queue', async () => {
    // Replace add<JobName> with the actual method name, e.g. addEmail, addReport
    await service.add<JobName>({ /* test data matching <QueueName>JobData */ } as <QueueName>JobData);
    expect(mockQueue.add).toHaveBeenCalledWith('<job-name>', expect.any(Object));
  });
});
```

## Registration in AppModule

Add the new module to `src/app.module.ts` imports array:

```typescript
import { <QueueName>Module } from '@/infrastructure/<queue-name>/<queue-name>.module';

// in @Module imports:
<QueueName>Module,
```

## Steps

1. Clarify the queue name, job name, and job payload structure if not provided
2. Create the four files above
3. Register in `app.module.ts`
4. Run `npm run check` to verify everything compiles
