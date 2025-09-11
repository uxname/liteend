import * as crypto from 'node:crypto';

import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import { OneTimeCode } from '@/app/one-time-code/types/one-time-code.object-type';
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
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiration time
    // Random 6 digits code
    const code = crypto.randomInt(100_000, 999_999).toString();

    // Check if there's an existing active code
    const existingCode = await this.prismaService.oneTimeCode.findUnique({
      where: { email },
    });

    // Only update or create a new code if necessary
    if (existingCode && existingCode.expiresAt > new Date()) {
      return existingCode; // If an active code exists, return it without changing
    }

    // Upsert the one-time code (create or update)
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

    if (!oneTimeCode || oneTimeCode.code !== code) {
      return false;
    }

    // Explicitly check for expiration
    return oneTimeCode.expiresAt.getTime() > Date.now();
  }

  async deleteOneTimeCode(email: string): Promise<boolean> {
    const result = await this.prismaService.oneTimeCode.delete({
      where: { email },
    });
    return Boolean(result);
  }

  @Process()
  async processOneTimeCode(
    job: Job<ProcessOneTimeCodeParameters>,
  ): Promise<void> {
    const { data } = job;
    try {
      await this.prismaService.oneTimeCode.delete({
        where: { id: data.oneTimeCodeId },
      });
    } catch (error) {
      // Log the error, in case the deletion fails
      console.error(
        `Failed to delete one-time code: ${data.oneTimeCodeId}`,
        error,
      );
    }
  }

  async addDeleteOneTimeCodeJob(
    oneTimeCodeId: number,
    runAt: Date,
  ): Promise<Job> {
    return this.accountSessionQueue.add(
      { oneTimeCodeId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        delay: runAt.getTime() - Date.now(),
        timeout: 10_000, // Timeout after 10 seconds to prevent deadlocks
      },
    );
  }
}
