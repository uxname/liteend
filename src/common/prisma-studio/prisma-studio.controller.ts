import {
  Body,
  Controller,
  Get,
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
  constructor(private readonly prismaStudioService: PrismaStudioService) {}

  @ApiExcludeEndpoint()
  @Get(ROUTES_GET)
  async proxyGet(
    @Req() request: Request,
    @Res() _response: Response,
  ): Promise<void> {
    await this.prismaStudioService.processRequest(request, _response);
  }

  @ApiExcludeEndpoint()
  @Post(ROUTES_POST)
  async proxyPost(
    @Req() request: RawBodyRequest<Request>,
    @Res() _response: Response,
    @Body() body: unknown,
  ): Promise<void> {
    request.body = body;
    await this.prismaStudioService.processRequest(request, _response);
  }
}
