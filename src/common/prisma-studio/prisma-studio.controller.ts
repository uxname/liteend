import {
  All,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

const STUDIO_ROUTES = [
  'studio',
  'studio/*',
  'bff',
  'bff/*',
  'telemetry',
  'api',
  'api/*',
  'ui',
  'ui/*',
  'data',
  'data/*',
  'assets',
  'assets/*',
  'favicon.ico',
  ':file(.*\\.(?:js|css|png|svg|ico|map|woff2))',
];

@Controller()
export class PrismaStudioController {
  private readonly logger = new Logger(PrismaStudioController.name);

  constructor(private readonly prismaStudioService: PrismaStudioService) {}

  @ApiExcludeEndpoint()
  @All(STUDIO_ROUTES)
  async proxy(
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply,
    @Body() body: unknown,
  ): Promise<void> {
    try {
      await this.prismaStudioService.processRequest(request, response, body);
    } catch (error) {
      if (!response.sent) {
        response
          .code(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('An error occurred while processing your request');
      }
      this.logger.error('Error processing Studio request:', error);
    }
  }
}
