import * as path from 'node:path';
import * as process from 'node:process';

import { Injectable, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import express from 'express';
import basicAuth from 'express-basic-auth';
import serveIndex from 'serve-index';

@Injectable()
export class LoggerServeService {
  constructor(
    private adapterHost: HttpAdapterHost,
    private readonly log: Logger,
  ) {
    const app = this.adapterHost.httpAdapter.getInstance();

    const authMiddleware = basicAuth({
      authorizeAsync: true,
      authorizer: (username, password, callback) => {
        // eslint-disable-next-line security/detect-object-injection
        const user = process.env.LOGS_ADMIN_PANEL_USER;
        const password_ = process.env.LOGS_ADMIN_PANEL_PASSWORD;
        // eslint-disable-next-line security/detect-possible-timing-attacks
        if (username === user && password === password_) {
          callback(undefined, true);
        } else {
          // delay to prevent brute force
          setTimeout(() => {
            log.warn(`Failed login attempt from ${username} to logs`);
            callback(undefined, false);
            // eslint-disable-next-line no-magic-numbers
          }, 3000);
        }
      },
      challenge: true,
      // eslint-disable-next-line no-magic-numbers
      realm: Math.random().toString(36).slice(7),
    });

    const logsDirectory = path.join(process.cwd(), 'data', 'logs');
    app.use(
      '/logs',
      authMiddleware,
      express.static(logsDirectory),
      serveIndex(logsDirectory, { icons: true }),
    );
  }
}
