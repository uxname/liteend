import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('test')
export class TestQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(TestQueueProcessor.name);

  async process(job: Job): Promise<unknown> {
    this.logger.log(
      `Start processing job ${job.id} (${job.name}). Data: ${JSON.stringify(job.data)}`,
    );

    // Эмулируем бурную деятельность (1 секунда)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Finished processing job ${job.id}`);
    return { result: 'Success' };
  }
}
