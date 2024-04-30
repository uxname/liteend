import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
export declare class ProfileCreateOrConnectWithoutAccountsInput {
    where: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
    create: ProfileCreateWithoutAccountsInput;
}
