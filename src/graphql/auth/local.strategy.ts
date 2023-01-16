import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '@/@generated/nestgraphql/account/account.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<Account> {
    const user = await this.authService.validateAccount(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
