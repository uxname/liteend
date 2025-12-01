import { All, Controller, NotFoundException } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @All()
  root(): void {
    throw new NotFoundException();
  }
}
