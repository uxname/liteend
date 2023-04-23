import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';

import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  test('should be defined', () => {
    expect(new RolesGuard([AccountRole.USER])).toBeDefined();
  });
});
