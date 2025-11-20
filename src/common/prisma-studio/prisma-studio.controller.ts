import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
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
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.prismaStudioService.processRequest(request, response);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('An error occurred while processing your request');
      // Log error (optional for debugging)
      this.logger.error('Error processing GET request:', error);
    }
  }

  @ApiExcludeEndpoint()
  @Post(ROUTES_POST)
  async proxyPost(
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
    @Body() body: unknown,
  ): Promise<void> {
    request.body = body;
    try {
      await this.prismaStudioService.processRequest(request, response);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('An error occurred while processing your request');
      // Log error (optional for debugging)
      this.logger.error('Error processing POST request:', error);
    }
  }
}
