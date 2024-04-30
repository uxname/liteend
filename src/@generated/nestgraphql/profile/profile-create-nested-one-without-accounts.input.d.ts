import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { ProfileCreateOrConnectWithoutAccountsInput } from './profile-create-or-connect-without-accounts.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
export declare class ProfileCreateNestedOneWithoutAccountsInput {
    create?: ProfileCreateWithoutAccountsInput;
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput;
    connect?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
}
