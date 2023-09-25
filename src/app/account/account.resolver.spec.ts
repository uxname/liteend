import path from 'node:path';
import process from 'node:process';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AccountModule } from '@/app/account/account.module';
import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { ProfileModule } from '@/app/profile/profile.module';
import { LoggerModule } from '@/common/logger/logger.module';

import { AccountResolver } from './account.resolver';

describe('UserResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountSessionModule,
        AccountModule,
        LoggerModule,
        ConfigModule,
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
        ProfileModule,
      ],
      providers: [AccountResolver],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
