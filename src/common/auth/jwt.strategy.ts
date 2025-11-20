import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Profile } from '@/app/profile/types/profile.object-type';
import { PrismaService } from '@/common/prisma/prisma.service';

interface JwtPayload {
  sub: string;
  iss: string;
  aud: string;
  scope?: string;
  roles?: string[];
  // biome-ignore lint/suspicious/noExplicitAny: any other fields
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const issuer = configService.getOrThrow<string>('OIDC_ISSUER');
    const audience = configService.getOrThrow<string>('OIDC_AUDIENCE');
    const jwksUri = configService.getOrThrow<string>('OIDC_JWKS_URI');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: audience,
      issuer: issuer,
      algorithms: ['RS256', 'ES384'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
    });
  }

  async validate(payload: JwtPayload): Promise<Profile> {
    if (!payload.sub) {
      throw new UnauthorizedException('Token has no subject (sub)');
    }

    const oidcSub = payload.sub;

    return this.prisma.profile.upsert({
      where: { oidcSub },
      create: {
        oidcSub,
      },
      update: {},
    });
  }
}
