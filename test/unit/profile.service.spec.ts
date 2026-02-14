import { Test, TestingModule } from '@nestjs/testing';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { ProfileService } from '@/app/profile/profile.service';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile: Profile = {
    id: 1,
    oidcSub: 'oauth2|12345',
    roles: [ProfileRole.USER],
    avatarUrl: 'https://example.com/avatar.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    profile: {
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateInput = { avatarUrl: 'https://new-avatar.com/img.png' };
      const updatedProfile = { ...mockProfile, ...updateInput };

      mockPrismaService.profile.update.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile(1, updateInput);

      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateInput,
      });
      expect(result.avatarUrl).toBe('https://new-avatar.com/img.png');
    });

    it('should throw error if profile not found', async () => {
      mockPrismaService.profile.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(
        service.updateProfile(999, { avatarUrl: 'test.png' }),
      ).rejects.toThrow('Record not found');
    });
  });
});
