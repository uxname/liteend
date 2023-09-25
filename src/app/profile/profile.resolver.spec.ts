import path from 'node:path';
import process from 'node:process';

import { Test, TestingModule } from '@nestjs/testing';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AccountModule } from '@/app/account/account.module';
import { ProfileModule } from '@/app/profile/profile.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { ProfileResolver } from './profile.resolver';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AccountModule,
        ProfileModule,
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
      providers: [ProfileResolver],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
