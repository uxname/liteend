import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

const ROUTES_GET = [
  'studio',
  'index.css',
  'http/databrowser.js',
  'assets/index.js',
  'assets/vendor.js',
];

const ROUTES_POST = ['api'];

@Controller()
export class PrismaStudioController {
  private readonly logger = new Logger(PrismaStudioController.name);

  constructor(private readonly prismaStudioService: PrismaStudioService) {}

  @ApiExcludeEndpoint()
  @Get(ROUTES_GET)
  async proxyGet(
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply,
  ): Promise<void> {
    try {
      await this.prismaStudioService.processRequest(request, response);
    } catch (error) {
      response
        .code(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('An error occurred while processing your request');
      this.logger.error('Error processing GET request:', error);
    }
  }

  @ApiExcludeEndpoint()
  @Post(ROUTES_POST)
  async proxyPost(
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply,
    @Body() body: unknown,
  ): Promise<void> {
    // В Fastify body уже распарсен в request.body, но для сервиса мы передадим его явно или через request
    try {
      await this.prismaStudioService.processRequest(request, response, body);
    } catch (error) {
      response
        .code(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('An error occurred while processing your request');
      this.logger.error('Error processing POST request:', error);
    }
  }
}
