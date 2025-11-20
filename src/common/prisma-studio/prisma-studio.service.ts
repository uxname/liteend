import { exec } from 'node:child_process';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ofetch } from 'ofetch';

@Injectable()
export class PrismaStudioService {
  private readonly logger = new Logger(PrismaStudioService.name);

  constructor(private readonly configService: ConfigService) {}

  // Starts the Prisma Studio locally
  async startStudio(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Run local Prisma Studio command
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

  // Processes the incoming request for Prisma Studio
  async processRequest(request: Request, response: Response): Promise<void> {
    const login = this.configService.getOrThrow<string>('PRISMA_STUDIO_LOGIN');
    const password = this.configService.getOrThrow<string>(
      'PRISMA_STUDIO_PASSWORD',
    );
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.error('Unauthorized');
      response
        .status(HttpStatus.UNAUTHORIZED)
        .header('WWW-Authenticate', 'Basic realm="Restricted"')
        .send('Unauthorized');
      return;
    }

    const auth = authHeader.split(' ')[1];
    if (!auth) {
      this.logger.error('Authorization header missing');
      response.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      return;
    }

    const [authLogin, authPassword] = Buffer.from(auth, 'base64')
      .toString()
      .split(':');

    if (authLogin !== login || authPassword !== password) {
      this.logger.error('Forbidden');
      response.status(HttpStatus.FORBIDDEN).send('Forbidden');
      return;
    }

    this.logger.log('Authorized');

    // Construct URL for request forwarding
    const url =
      request.url === '/studio'
        ? 'http://localhost:5555'
        : `http://localhost:5555${request.url}`;

    try {
      const proxyResponse = await ofetch.raw(url, {
        method: request.method,
        headers: request.headers as Record<string, string>,
        body: request.method === 'POST' ? request.body : undefined,
        ignoreResponseError: true,
        responseType: 'arrayBuffer',
      });

      response.status(proxyResponse.status);

      proxyResponse.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'content-length' || lowerKey === 'content-encoding') {
          return;
        }
        response.setHeader(key, value);
      });

      if (proxyResponse._data) {
        response.send(Buffer.from(proxyResponse._data));
      } else {
        response.end();
      }
    } catch (error) {
      this.logger.error('Error while processing the request:', error);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
