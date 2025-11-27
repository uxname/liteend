import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { ProfileService } from '@/app/profile/profile.service';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';
import {
  CurrentUser,
  CurrentUserType,
} from '@/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/roles.guard';

const EVENTS = {
  PROFILE_UPDATED: 'profileUpdated',
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { name: 'me' })
  async me(@CurrentUser() user: CurrentUserType): Promise<Profile> {
    return user;
  }

  @Mutation(() => Profile)
  async updateProfile(
    @CurrentUser() user: CurrentUserType,
    @Args('input') input: ProfileUpdateInput,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<Profile> {
    const updatedProfile = await this.profileService.updateProfile(
      user.id,
      input,
    );

    await pubSub.publish({
      topic: EVENTS.PROFILE_UPDATED,
      payload: {
        profileUpdated: updatedProfile,
      },
    });

    return updatedProfile;
  }

  @Subscription(() => Profile, {
    name: EVENTS.PROFILE_UPDATED,
    filter: (payload, _variables, context) => {
      const updatedProfileId = payload.profileUpdated.id;
      const currentUserId = context.req?.user?.id;
      return currentUserId === updatedProfileId;
    },
  })
  profileUpdated(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe(EVENTS.PROFILE_UPDATED);
  }
}
