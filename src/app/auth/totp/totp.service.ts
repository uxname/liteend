import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';

@Injectable()
export class TotpService {
  private readonly secret: string;
  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.getOrThrow<string>('TOTP_SECRET');
  }

  generateToken(): string {
    return authenticator.generate(this.secret);
  }

  verifyToken(token: string): boolean {
    return authenticator.check(token, this.secret);
  }
}
