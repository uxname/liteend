import { Module } from '@nestjs/common';
import { AuthConfigResolver } from './auth-config.resolver';

@Module({
  providers: [AuthConfigResolver],
})
export class AuthConfigModule {}
