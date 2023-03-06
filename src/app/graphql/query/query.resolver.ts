import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import appInfo from '@/../app-info.json';

@Resolver(() => Query)
export class QueryResolver {
  constructor(private readonly logger: Logger) {}

  @Query(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    this.logger.error(process.env);
    this.logger.log({ resolver: 'echo', text });
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
      appInfo,
    };
  }
}
