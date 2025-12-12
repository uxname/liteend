import { SetMetadata } from '@nestjs/common';
import { ProfileRole } from '@/@generated/prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ProfileRole[]) => SetMetadata(ROLES_KEY, roles);
