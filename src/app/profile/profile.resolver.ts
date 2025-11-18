import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ProfileService } from '@/app/profile/profile.service';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  async updateProfile(
    @Args('input') input: ProfileUpdateInput,
  ): Promise<Profile> {
    return this.profileService.updateProfile('oidcSub', {
      avatarUrl: input.avatarUrl,
    });
  }
}
