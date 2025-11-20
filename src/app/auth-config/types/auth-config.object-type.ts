import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthConfig {
  @Field(() => String, {
    description: 'OIDC Issuer URL (e.g. Logto/Auth0 domain)',
  })
  authority!: string;

  @Field(() => String, {
    description: 'Public Client ID for the Frontend application',
  })
  clientId!: string;

  @Field(() => String, { description: 'Where to redirect after login' })
  redirectUri!: string;

  @Field(() => String, { description: 'OIDC Scopes (space separated)' })
  scope!: string;

  @Field(() => String, {
    description: 'Audience for the API (Resource Identifier)',
  })
  audience!: string;
}
