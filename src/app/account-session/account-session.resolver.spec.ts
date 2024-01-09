import path from 'node:path';
import process from 'node:process';

import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { TotpModule } from '@/app/auth/totp/totp.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountSessionResolver } from './account-session.resolver';
import { AccountSessionService } from './account-session.service';

describe('AccountSessionResolver', () => {
  let resolver: AccountSessionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        TotpModule,
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
      ],
      providers: [AccountSessionResolver, AccountSessionService],
    }).compile();

    resolver = module.get<AccountSessionResolver>(AccountSessionResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
