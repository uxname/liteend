import { exec } from 'node:child_process';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ofetch } from 'ofetch';

@Injectable()
export class PrismaStudioService {
  private readonly logger = new Logger(PrismaStudioService.name);

  constructor(private readonly configService: ConfigService) {}

  async startStudio(): Promise<void> {
    this.logger.error('Hack: does not started prisma studio. TODO: FIX IT');
    if (Math.random() > -1) {
      return;
    }
    return new Promise<void>((resolve, reject) => {
      exec('npm run db:studio', (error, stdout, stderr) => {
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

  async processRequest(
    request: FastifyRequest,
    response: FastifyReply,
    body?: unknown,
  ): Promise<void> {
    const login = this.configService.getOrThrow<string>('PRISMA_STUDIO_LOGIN');
    const password = this.configService.getOrThrow<string>(
      'PRISMA_STUDIO_PASSWORD',
    );
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.error('Unauthorized');
      response
        .code(HttpStatus.UNAUTHORIZED)
        .header('WWW-Authenticate', 'Basic realm="Restricted"')
        .send('Unauthorized');
      return;
    }

    const auth = authHeader.split(' ')[1];
    if (!auth) {
      this.logger.error('Authorization header missing');
      response.code(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      return;
    }

    const [authLogin, authPassword] = Buffer.from(auth, 'base64')
      .toString()
      .split(':');

    if (authLogin !== login || authPassword !== password) {
      this.logger.error('Forbidden');
      response.code(HttpStatus.FORBIDDEN).send('Forbidden');
      return;
    }

    this.logger.log('Authorized');

    const urlStr = request.url;
    // Fastify: request.url содержит полный путь, например /studio или /api
    const url =
      urlStr === '/studio'
        ? 'http://localhost:5555'
        : `http://localhost:5555${urlStr}`;

    try {
      const proxyResponse = await ofetch.raw(url, {
        method: request.method as string,
        headers: request.headers as Record<string, string>,
        body: (request.method === 'POST'
          ? (body ?? request.body)
          : // biome-ignore lint/suspicious/noExplicitAny: ofetch body types are strict
            undefined) as any,
        ignoreResponseError: true,
        responseType: 'arrayBuffer',
      });

      response.code(proxyResponse.status);

      proxyResponse.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'content-length' || lowerKey === 'content-encoding') {
          return;
        }
        response.header(key, value);
      });

      if (proxyResponse._data) {
        response.send(Buffer.from(proxyResponse._data));
      } else {
        response.send();
      }
    } catch (error) {
      this.logger.error('Error while processing the request:', error);
      response
        .code(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
