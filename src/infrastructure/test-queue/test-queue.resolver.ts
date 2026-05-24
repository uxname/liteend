import { InjectQueue } from '@nestjs/bullmq';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';

@Resolver()
export class TestQueueResolver {
  constructor(@InjectQueue('test') private readonly testQueue: Queue) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: 'Adds a job to the test queue' })
  async addTestJob(
    @Args('message', { type: () => String }) message: string,
  ): Promise<boolean> {
    await this.testQueue.add(
      'test-job',
      { message, date: new Date().toISOString() },
      { deduplication: { id: `dedup:test:${message}`, ttl: 60000 } },
    );
    return true;
  }
}
