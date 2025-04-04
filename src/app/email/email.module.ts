import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('EMAIL_HOST'),
          port: Number.parseInt(
            configService.getOrThrow<string>('EMAIL_PORT'),
            10,
          ),
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: configService.getOrThrow<string>('EMAIL_USER'),
            pass: configService.getOrThrow<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.getOrThrow<string>('EMAIL_USER'),
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
