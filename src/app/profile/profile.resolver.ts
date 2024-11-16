import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Account } from '@/app/account/types';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { ProfileService } from '@/app/profile/profile.service';
import { Profile, ProfileUpdateInput } from '@/app/profile/types';
import { RequestContextDecorator } from '@/app/request-context.decorator';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  @UseGuards(AuthGuard)
  async updateProfile(
    @RequestContextDecorator() context: RequestContext,
    @Args('input') input: ProfileUpdateInput,
  ): Promise<Profile> {
    // Should be because AuthGuard is used
    return this.profileService.updateProfile(context.account!.profileId!, {
      name: input.name,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    });
  }

  @ResolveField(() => [Account])
  @UseGuards(AuthGuard)
  async accounts(
    @RequestContextDecorator() context: RequestContext,
    @Parent() parent: Profile,
  ): Promise<Account[]> {
    if (context.account!.profileId !== parent.id) {
      throw new Error('You are not allowed to access this profile');
    }
    return this.profileService.getAccounts(parent.id);
  }
}
