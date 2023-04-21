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
  private async processEmailSend(job: Job<ProcessEmailSendParameters>) {
    const { data } = job;
    await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job<ProcessEmailSendParameters>, result: SentMessageInfo) {
    this.logger.log({
      jobId: job.id,
      result,
    });
  }

  @OnQueueFailed()
  onFailed(job: Job<ProcessEmailSendParameters>, error: Error) {
    this.logger.error({
      jobId: job.id,
      attempts: job.attemptsMade,
      error,
    });
  }
}
