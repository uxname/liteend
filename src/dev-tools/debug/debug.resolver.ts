import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/@generated/i18n-types';
import { ProfileRole } from '@/@generated/prisma/enums';
import {
  CurrentUser,
  CurrentUserType,
} from '@/common/auth/current-user.decorator';
import { JwtOptionalAuthGuard } from '@/common/auth/jwt-optional-auth.guard';
import { Roles } from '@/common/auth/roles.decorator';
import { RolesGuard } from '@/common/auth/roles.guard';
import { CommitInfo } from '@/common/git-commit-saver';
import { PrismaService } from '@/common/prisma/prisma.service';
import packageJson from '../../../package.json';

const LAST_COMMIT_INFO_FILE_PATH = path.resolve(
  process.cwd(),
  'dist',
  'last-commit-info.json',
);

@UseGuards(JwtOptionalAuthGuard, RolesGuard)
@Roles(ProfileRole.ADMIN)
@Resolver(() => Query)
export class DebugResolver {
  private static readonly logger = new Logger(DebugResolver.name);

  constructor(private readonly prisma: PrismaService) {}

  private static readLastCommitInfo(): CommitInfo | undefined {
    try {
      return JSON.parse(readFileSync(LAST_COMMIT_INFO_FILE_PATH, 'utf8'));
    } catch (error) {
      DebugResolver.logger.error(
        'Error reading last commit info. Returning empty commit info.',
        error,
      );
      return undefined;
    }
  }

  @Query(() => String, {
    name: 'testTranslation',
    description: 'Test i18n translation by username',
  })
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

  @Query(() => String, {
    name: 'echo',
    description: 'Echo back the input text (dev utility)',
  })
  echo(@Args('text', { type: () => String }) text: string): string {
    DebugResolver.logger.log({ resolver: 'echo', text });
    return text;
  }

  @Mutation(() => String, {
    name: 'echo',
    description: 'Echo mutation — returns the input text (dev utility)',
  })
  echoMutation(@Args('text', { type: () => String }) text: string): string {
    return text;
  }

  @Query(() => GraphQLJSON, { name: 'debug' })
  async debug(@CurrentUser() user: CurrentUserType): Promise<unknown> {
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

    let totalUsers: number | undefined;

    if (user?.roles.includes(ProfileRole.ADMIN)) {
      totalUsers = await this.prisma.profile.count();
    }

    const memoryUsage = process.memoryUsage();

    return {
      serverTime: new Date().toISOString(),
      uptime: uptimePretty,
      appInfo: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      lastCommit:
        DebugResolver.readLastCommitInfo() || 'No commit info available',
      totalUsers,
      requester: user
        ? `User ID: ${user.id} (${user.roles.join(', ')})`
        : 'Anonymous',
    };
  }
}
