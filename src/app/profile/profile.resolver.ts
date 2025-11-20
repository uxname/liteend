import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ProfileService } from '@/app/profile/profile.service';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';
import {
  CurrentUser,
  CurrentUserType,
} from '@/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/roles.guard';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';

const EVENTS = {
  PROFILE_UPDATED: 'profileUpdated',
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => Profile, { name: 'me' })
  async me(@CurrentUser() user: CurrentUserType): Promise<Profile> {
    return user;
  }

  @Mutation(() => Profile)
  async updateProfile(
    @CurrentUser() user: CurrentUserType,
    @Args('input') input: ProfileUpdateInput,
  ): Promise<Profile> {
    const updatedProfile = await this.profileService.updateProfile(
      user.id,
      input,
    );

    await this.pubSub.publish(EVENTS.PROFILE_UPDATED, {
      profileUpdated: updatedProfile,
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
  profileUpdated() {
    return this.pubSub.asyncIterator(EVENTS.PROFILE_UPDATED);
  }
}
