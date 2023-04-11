import process from 'node:process';

import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerModule } from '@nestjs-modules/mailer';

import { LoggerModule } from '@/common/logger/logger.module';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        BullModule.forRoot({
          redis: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
          },
        }),
        BullModule.registerQueue({
          name: 'email',
        }),
        MailerModule.forRoot({
          transport: {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          },
          defaults: {
            from: '"test" <kayley22@ethereal.email>',
          },
        }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should send email', async () => {
    const to = 'kayley22@ethereal.email';
    const subject = 'Test email';
    const text = 'Test email';

    const result = await service.sendEmail(to, subject, text);
    expect(result.id).toBeDefined();
  });

  // afterAll(async () => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // });
});
