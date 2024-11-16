import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { I18n, I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Logger } from '@/common/logger/logger';
import { PrismaService } from '@/common/prisma/prisma.service';

import packageJson from '../../../package.json';

interface CommitInfo {
  name: string;
  hash: string;
}

const LAST_COMMIT_INFO_FILE_PATH = path.resolve(
  process.cwd(),
  'dist',
  'last-commit-info.json',
);

@Resolver(() => Query)
export class DebugResolver {
  private static readonly logger: Logger = new Logger(DebugResolver.name);

  private static readLastCommitInfo(): CommitInfo | undefined {
    try {
      return JSON.parse(readFileSync(LAST_COMMIT_INFO_FILE_PATH, 'utf8'));
    } catch (error) {
      this.logger.error(
        'Error reading last commit info. Returning empty commit info.',
        error,
      );
      return undefined;
    }
  }

  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => String, { name: 'testTranslation' })
  testTranslation(
    @Args('username', { type: () => String }) username: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): string {
    return i18n.t('translations.hello', {
      args: {
        username,
      },
    });
  }

  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    DebugResolver.logger.log({ resolver: 'echo', text });
    return text;
  }

  @Mutation(() => String, { name: 'echo' })
  echoMutation(@Args('text', { type: () => String }) text: string): string {
    return text;
  }

  @Query(() => GraphQLJSON, { name: 'debug' })
  debug(): unknown {
    const SECONDS_IN_DAY = 86_400;
    const SECONDS_IN_HOUR = 3600;
    const SECONDS_IN_MINUTE = 60;
    const uptime = process.uptime();
    const uptimeDays = Math.floor(uptime / SECONDS_IN_DAY);
    const uptimeHours = Math.floor((uptime % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
    const uptimeMinutes = Math.floor(
      ((uptime % SECONDS_IN_DAY) % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    );
    const uptimeSeconds = Math.floor(
      ((uptime % SECONDS_IN_DAY) % SECONDS_IN_HOUR) % SECONDS_IN_MINUTE,
    );
    const uptimePretty = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    return {
      serverTime: new Date().toISOString(),
      uptime: uptimePretty,
      appInfo: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
      },
      lastCommit:
        DebugResolver.readLastCommitInfo() || 'No commit info available',
    };
  }
}
