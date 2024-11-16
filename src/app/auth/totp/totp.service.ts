import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class TotpService {
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  generateToken(secret: string): string {
    return authenticator.generate(secret);
  }

  verifyToken(secret: string, token: string): boolean {
    return authenticator.check(token, secret);
  }
}
