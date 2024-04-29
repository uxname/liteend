import {
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

const ROUTES = [
  'studio',
  'api',
  'index.css',
  'http/databrowser.js',
  'assets/index.js',
  'assets/vendor.js',
];

@Controller()
export class PrismaStudioController {
  constructor(private readonly prismaStudioService: PrismaStudioService) {}
  @Get(ROUTES)
  async proxyGet(
    @Req() request: Request,
    @Res() _response: Response,
  ): Promise<void> {
    await this.prismaStudioService.processRequest(request, _response);
  }

  @Post(ROUTES)
  async proxyPost(
    @Req() request: RawBodyRequest<Request>,
    @Res() _response: Response,
    @Body() body: unknown,
  ): Promise<void> {
    request.body = body;
    await this.prismaStudioService.processRequest(request, _response);
  }
}
