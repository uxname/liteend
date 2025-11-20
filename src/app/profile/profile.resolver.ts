import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from '@/app/profile/profile.service';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';
import {
  CurrentUser,
  CurrentUserType,
} from '@/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard) // Защищаем весь резолвер
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
  ): Promise<Profile> {
    return this.profileService.updateProfile(user.id, input);
  }
}
