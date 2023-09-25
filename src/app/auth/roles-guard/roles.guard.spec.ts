import { ProfileRole } from '@/@generated/nestgraphql/prisma/profile-role.enum';

import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  test('should be defined', () => {
    expect(new RolesGuard([ProfileRole.USER])).toBeDefined();
  });
});
