import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class MutationResolver {
  @Mutation(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }
}
