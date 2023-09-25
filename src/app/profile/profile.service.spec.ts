import path from 'node:path';
import process from 'node:process';

import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AccountModule } from '@/app/account/account.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
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
        AccountModule,
      ],
      providers: [ProfileService],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
