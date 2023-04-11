import { Test, TestingModule } from '@nestjs/testing';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRoot({
          transport: {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: 'porter.carroll23@ethereal.email',
              pass: 'n3eKNckQJxcJ3h8Jvy',
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
    expect(result.messageId).toBeDefined();
  });
});
