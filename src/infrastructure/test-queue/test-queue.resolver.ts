import { InjectQueue } from '@nestjs/bullmq';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Queue } from 'bullmq';

@Resolver()
export class TestQueueResolver {
  constructor(@InjectQueue('test') private readonly testQueue: Queue) {}

  @Mutation(() => Boolean, { description: 'Adds a job to the test queue' })
  async addTestJob(
    @Args('message', { type: () => String }) message: string,
  ): Promise<boolean> {
    await this.testQueue.add('test-job', {
      message,
      date: new Date().toISOString(),
    });
    return true;
  }
}
