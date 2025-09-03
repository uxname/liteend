import { registerEnumType } from '@nestjs/graphql';
import { AccountStatus } from '@prisma/client';

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
  description: undefined,
});

export { AccountStatus };
