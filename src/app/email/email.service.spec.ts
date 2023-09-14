import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EmailModule } from '@/app/email/email.module';
import { LoggerModule } from '@/common/logger/logger.module';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule, EmailModule],
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
