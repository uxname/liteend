import path from 'node:path';
import process from 'node:process';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountGateway } from './account.gateway';

describe('AccountGateway', () => {
  let gateway: AccountGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        PrismaModule,
        AccountSessionModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(process.cwd(), 'src', 'i18n'),
            watch: true,
          },
          resolvers: [AcceptLanguageResolver],
          logging: true,
          typesOutputPath: path.join(
            process.cwd(),
            'src',
            '@generated',
            'i18n-types.ts',
          ),
        }),
        ConfigModule.forRoot(),
      ],
      providers: [AccountGateway],
    }).compile();

    gateway = module.get<AccountGateway>(AccountGateway);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
