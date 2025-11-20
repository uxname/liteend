import { ConfigService } from '@nestjs/config';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthConfig } from './types/auth-config.object-type';

@Resolver(() => AuthConfig)
export class AuthConfigResolver {
  constructor(private readonly configService: ConfigService) {}

  @Query(() => AuthConfig, {
    name: 'authConfig',
    description:
      'Exposes public OIDC configuration for the frontend to bootstrap authentication',
  })
  getAuthConfig(): AuthConfig {
    return {
      authority: this.configService.getOrThrow<string>('OIDC_ISSUER'),
      clientId: this.configService.getOrThrow<string>('OIDC_CLIENT_ID'),
      redirectUri: this.configService.getOrThrow<string>('OIDC_REDIRECT_URI'),
      scope: this.configService.getOrThrow<string>('OIDC_SCOPES'),
      audience: this.configService.getOrThrow<string>('OIDC_AUDIENCE'),
    };
  }
}
