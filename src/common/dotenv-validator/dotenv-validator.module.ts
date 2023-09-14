import { Module } from '@nestjs/common';

import { DotenvValidatorService } from './dotenv-validator.service';

@Module({
  providers: [DotenvValidatorService],
})
export class DotenvValidatorModule {}
