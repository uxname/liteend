import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/roles.guard';
import {
  createProfileServiceMock,
  createPubSubMock,
} from '../../../test/utils/mocks';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { ProfileUpdateInput } from './types/profile-update.input';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let profileService: ReturnType<typeof createProfileServiceMock>;
  let pubSub: ReturnType<typeof createPubSubMock>;

  beforeEach(async () => {
    profileService = createProfileServiceMock();
    pubSub = createPubSubMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        { provide: ProfileService, useValue: profileService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .compile();

    resolver = module.get(ProfileResolver);
  });

  describe('me', () => {
    it('should return the current user payload verbatim', async () => {
      const currentUser: Profile = {
        id: 1,
        oidcSub: 'oauth2|12345',
        roles: [ProfileRole.USER],
        avatarUrl: 'https://example.com/avatar.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await resolver.me(currentUser);

      expect(result).toEqual(currentUser);
    });
  });

  describe('updateProfile', () => {
    it('should update the profile and publish an event', async () => {
      const currentUser: Profile = {
        id: 1,
        oidcSub: 'oauth2|12345',
        roles: [ProfileRole.USER],
        avatarUrl: 'https://example.com/avatar.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const input: ProfileUpdateInput = {
        avatarUrl: 'https://new.com/ava.png',
      };
      const updatedProfile: Profile = { ...currentUser, ...input };

      profileService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await resolver.updateProfile(currentUser, input, pubSub);

      expect(result).toEqual(updatedProfile);
      expect(profileService.updateProfile).toHaveBeenCalledWith(1, input);
      expect(pubSub.publish).toHaveBeenCalledWith({
        topic: 'profileUpdated',
        payload: { profileUpdated: updatedProfile },
      });
    });

    it('should only publish an event to the matching user', () => {
      const filter = (
        payload: { profileUpdated: { id: number } },
        _vars: Record<string, unknown>,
        context: { req?: { user?: { id: number } } },
      ) => {
        const updatedId = payload.profileUpdated.id;
        const currentUserId = context.req?.user?.id;
        return updatedId === currentUserId;
      };

      expect(
        filter({ profileUpdated: { id: 1 } }, {}, { req: { user: { id: 1 } } }),
      ).toBe(true);
      expect(
        filter({ profileUpdated: { id: 1 } }, {}, { req: { user: { id: 2 } } }),
      ).toBe(false);
    });
  });
});
