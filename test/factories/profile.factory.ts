import { PrismaClient, Profile, ProfileRole } from '@/@generated/prisma/client';

// Creates a profile with default values. Pass overrides to customize specific fields.
export async function createProfile(
  prisma: PrismaClient,
  overrides?: Partial<Profile>,
): Promise<Profile> {
  const defaultSub = `oauth2|test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return prisma.profile.create({
    data: {
      oidcSub: overrides?.oidcSub ?? defaultSub,
      roles: overrides?.roles ?? [ProfileRole.USER],
      avatarUrl: overrides?.avatarUrl ?? null,
      ...overrides,
    },
  });
}
