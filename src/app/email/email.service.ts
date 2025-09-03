import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job, Queue } from 'bull';
import { SentMessageInfo } from 'nodemailer';

import { Logger } from '@/common/logger/logger';

interface ProcessEmailSendParameters {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Processor('email')
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);

  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue<ProcessEmailSendParameters>,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<Job<ProcessEmailSendParameters>> {
    return await this.emailQueue.add(
      {
        to,
        subject,
        text,
        html,
      },
      {
        attempts: 10,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }

  @Process()
  // @ts-expect-error Used through the @Process() decorator
  private async _processEmailSend(
    job: Job<ProcessEmailSendParameters>,
  ): Promise<void> {
    const { data } = job;

    try {
      await this.mailerService.sendMail({
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });

      this.logger.log({
        jobId: job.id,
        message: 'Email sent successfully',
        recipient: data.to,
      });
    } catch (error) {
      this.logger.error({
        jobId: job.id,
        error,
        message: 'Failed to send email',
        recipient: data.to,
      });

      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(
    job: Job<ProcessEmailSendParameters>,
    result: SentMessageInfo,
  ): void {
    this.logger.log({
      jobId: job.id,
      result,
      message: 'Email sent successfully',
    });
  }

  @OnQueueFailed()
  onFailed(job: Job<ProcessEmailSendParameters>, error: Error): void {
    this.logger.error({
      jobId: job.id,
      attempts: job.attemptsMade,
      error,
      message: 'Email sending failed',
    });
  }
}
