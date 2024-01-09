import path from 'node:path';
import process from 'node:process';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { TotpModule } from '@/app/auth/totp/totp.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CryptoModule,
        TotpModule,
        ConfigModule.forRoot(),
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
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
