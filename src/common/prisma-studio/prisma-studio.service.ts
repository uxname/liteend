import { exec } from 'node:child_process';

import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';

import { Logger } from '@/common/logger/logger';

@Injectable()
export class PrismaStudioService {
  private readonly logger = new Logger(PrismaStudioService.name);

  constructor(private readonly configService: ConfigService) {}

  async startStudio(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      exec('npm run db:studio-local', (error, stdout, stderr) => {
        if (error) {
          this.logger.error('Command execution error:', error);
          return reject(error);
        }

        this.logger.log('Command execution stdout:', stdout);
        this.logger.error('Command execution stderr:', stderr);
        return resolve();
      });
    });
  }

  // eslint-disable-next-line complexity
  async processRequest(request: Request, _response: Response): Promise<void> {
    const login = this.configService.getOrThrow<string>('PRISMA_STUDIO_LOGIN');
    const password = this.configService.getOrThrow<string>(
      'PRISMA_STUDIO_PASSWORD',
    );
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const auth = authHeader.split(' ')[1];
      if (auth) {
        const [authLogin, authPassword] = Buffer.from(auth, 'base64')
          .toString()
          .split(':');
        if (authLogin === login && authPassword === password) {
          this.logger.log('Authorized');
          // ... rest of the method
        } else {
          this.logger.error('Forbidden');
          _response.status(HttpStatus.FORBIDDEN).send('Forbidden');
          return;
        }
      } else {
        this.logger.error('auth is null');
        return;
      }
    } else {
      this.logger.error('Unauthorized');
      _response
        .status(HttpStatus.UNAUTHORIZED)
        .header('WWW-Authenticate', 'Basic realm="Restricted"')
        .send('Unauthorized');
      return;
    }

    const url =
      request.url === '/studio'
        ? 'http://localhost:5555'
        : `http://localhost:5555${request.url}`;

    const response = await axios({
      method: request.method,
      url: url,
      headers: request.headers,
      data: request.method === 'POST' ? request.body : undefined,
    });

    const { data, status, headers } = response;

    _response.status(status);
    for (const header in headers) {
      if (headers.hasOwnProperty(header)) {
        // eslint-disable-next-line security/detect-object-injection
        _response.setHeader(header, headers[header]);
      }
    }
    _response.send(data);
  }
}
