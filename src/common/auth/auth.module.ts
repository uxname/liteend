import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
