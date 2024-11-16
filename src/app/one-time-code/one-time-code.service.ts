import * as crypto from 'node:crypto';

import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import { OneTimeCode } from '@/app/one-time-code/types';
import { PrismaService } from '@/common/prisma/prisma.service';

interface ProcessOneTimeCodeParameters {
  oneTimeCodeId: number;
}

@Processor('one-time-code')
export class OneTimeCodeService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('one-time-code')
    private readonly accountSessionQueue: Queue<ProcessOneTimeCodeParameters>,
  ) {}

  async createOneTimeCode(email: string): Promise<OneTimeCode> {
    // 30 minutes
    // eslint-disable-next-line no-magic-numbers
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    // Random 6 numbers
    // eslint-disable-next-line no-magic-numbers
    const code = crypto.randomInt(100_000, 999_999).toString();

    const otc = await this.prismaService.oneTimeCode.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    await this.addDeleteOneTimeCodeJob(otc.id, expiresAt);

    return otc;
  }

  async validateOneTimeCode(email: string, code: string): Promise<boolean> {
    const oneTimeCode = await this.prismaService.oneTimeCode.findUnique({
      where: { email },
    });

    if (!oneTimeCode) {
      return false;
    }

    if (oneTimeCode.code !== code) {
      return false;
    }

    return oneTimeCode.expiresAt >= new Date();
  }

  async deleteOneTimeCode(email: string): Promise<boolean> {
    await this.prismaService.oneTimeCode.delete({ where: { email } });
    return true;
  }

  @Process()
  async processOneTimeCode(
    job: Job<ProcessOneTimeCodeParameters>,
  ): Promise<void> {
    const { data } = job;
    await this.prismaService.oneTimeCode.delete({
      where: { id: data.oneTimeCodeId },
    });
  }

  async addDeleteOneTimeCodeJob(
    oneTimeCodeId: number,
    runAt: Date,
  ): Promise<Job> {
    return await this.accountSessionQueue.add(
      { oneTimeCodeId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        delay: runAt.getTime() - Date.now(),
      },
    );
  }
}
