import { HttpStatus, MiddlewareConsumer, Module } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Filter, Options } from 'http-proxy-middleware/dist/types';

import { Logger } from '@/common/logger/logger';
import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

@Module({
  providers: [PrismaStudioService],
})
export class PrismaStudioModule {
  private readonly logger = new Logger(PrismaStudioModule.name);
  private readonly ROUTE = 'studio';

  constructor(private readonly prismaStudioService: PrismaStudioService) {}

  configure(consumer: MiddlewareConsumer) {
    // noinspection JSIgnoredPromiseFromCall
    this.prismaStudioService.startStudio();
    const proxyOptions: Filter | Options = {
      target: 'http://localhost:5555',
      changeOrigin: true,
      pathRewrite: {
        [`^/${this.ROUTE}`]: '',
      },
      onProxyReq: (proxyRequest, request, response) => {
        const login = process.env.PRISMA_STUDIO_LOGIN;
        const password = process.env.PRISMA_STUDIO_PASSWORD;
        const authHeader = proxyRequest.getHeader('Authorization');
        if (authHeader) {
          if (typeof authHeader !== 'string') {
            this.logger.error('authHeader is not a string');
            return;
          }
          const auth = authHeader.split(' ')[1];
          if (!auth) {
            this.logger.error('auth is null');
            return;
          }
          const [authLogin, authPassword] = Buffer.from(auth, 'base64')
            .toString()
            .split(':');
          if (authLogin === login && authPassword === password) {
            this.logger.log('Authorized');
          } else {
            this.logger.error('Forbidden');
            response
              .status(HttpStatus.FORBIDDEN)
              .header('Cache-Control', 'no-cache')
              .header('WWW-Authenticate', 'Basic realm="Restricted"')
              .send('Forbidden');
          }
        } else {
          this.logger.error('Unauthorized');
          response
            .status(HttpStatus.UNAUTHORIZED)
            .header('Cache-Control', 'no-cache')
            .header('WWW-Authenticate', 'Basic realm="Restricted"')
            .send('Unauthorized');
        }
      },
    };

    consumer.apply(createProxyMiddleware(proxyOptions)).forRoutes(this.ROUTE);

    consumer.apply(createProxyMiddleware(proxyOptions)).forRoutes('/api');
    consumer
      .apply(createProxyMiddleware(proxyOptions))
      .forRoutes('/http/databrowser.js');
    consumer
      .apply(createProxyMiddleware(proxyOptions))
      .forRoutes('/assets/index.js');
    consumer
      .apply(createProxyMiddleware(proxyOptions))
      .forRoutes('/assets/vendor.js');
    consumer.apply(createProxyMiddleware(proxyOptions)).forRoutes('/index.css');
  }
}
