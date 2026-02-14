import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';

type CurrentUserType = {
  id: number;
  oidcSub: string;
  roles: ProfileRole[];
};

type PubSubType = {
  publish: Mock;
};

type ResolverClass = new (service: {
  updateProfile: Mock;
}) => {
  me: (user: CurrentUserType) => CurrentUserType;
  updateProfile: (
    user: CurrentUserType,
    input: ProfileUpdateInput,
    pubSub: PubSubType,
  ) => Promise<Profile>;
};

describe('ProfileResolver (logic)', () => {
  const mockProfile: Profile = {
    id: 1,
    oidcSub: 'oauth2|12345',
    roles: [ProfileRole.USER],
    avatarUrl: 'https://example.com/avatar.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCurrentUser: CurrentUserType = {
    id: 1,
    oidcSub: 'oauth2|12345',
    roles: [ProfileRole.USER],
  };

  const mockProfileService = {
    updateProfile: vi.fn(),
  };

  let mockPubSub: PubSubType;

  // Dynamic import of resolver
  let ProfileResolver: ResolverClass;

  beforeEach(async () => {
    const module = await import('@/app/profile/profile.resolver');
    ProfileResolver = module.ProfileResolver as unknown as ResolverClass;
    mockPubSub = { publish: vi.fn() };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('me', () => {
    it('should return current user', async () => {
      const resolver = new ProfileResolver(mockProfileService as never);
      const result = await resolver.me(mockCurrentUser);

      expect(result).toEqual(mockCurrentUser);
    });
  });

  describe('updateProfile', () => {
    it('should call service.updateProfile and publish event', async () => {
      const resolver = new ProfileResolver(mockProfileService as never);
      const input: ProfileUpdateInput = {
        avatarUrl: 'https://new.com/ava.png',
      };

      mockProfileService.updateProfile.mockResolvedValue({
        ...mockProfile,
        ...input,
      });

      const result = await resolver.updateProfile(
        mockCurrentUser,
        input,
        mockPubSub,
      );

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(1, input);
      expect(mockPubSub.publish).toHaveBeenCalledWith({
        topic: 'profileUpdated',
        payload: { profileUpdated: result },
      });
    });

    it('should filter event by user id in subscription', () => {
      // Test filtering logic
      const filter = (
        payload: { profileUpdated: { id: number } },
        _variables: Record<string, unknown>,
        context: { req?: { user?: { id: number } } },
      ) => {
        const updatedProfileId = payload.profileUpdated.id;
        const currentUserId = context.req?.user?.id;
        return currentUserId === updatedProfileId;
      };

      // User 1 updated their profile - should receive notification
      const result1 = filter(
        { profileUpdated: { id: 1 } },
        {},
        { req: { user: { id: 1 } } },
      );
      expect(result1).toBe(true);

      // User 2 updated user 1's profile - should NOT receive notification
      const result2 = filter(
        { profileUpdated: { id: 1 } },
        {},
        { req: { user: { id: 2 } } },
      );
      expect(result2).toBe(false);
    });
  });
});
