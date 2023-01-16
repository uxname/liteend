import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class MutationResolver {
  // todo add text limit guard
  @Mutation(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }
}
