import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { ProfileCreateOrConnectWithoutAccountsInput } from './profile-create-or-connect-without-accounts.input';
import { ProfileUpsertWithoutAccountsInput } from './profile-upsert-without-accounts.input';
import { ProfileWhereInput } from './profile-where.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileUpdateToOneWithWhereWithoutAccountsInput } from './profile-update-to-one-with-where-without-accounts.input';
export declare class ProfileUpdateOneWithoutAccountsNestedInput {
    create?: ProfileCreateWithoutAccountsInput;
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput;
    upsert?: ProfileUpsertWithoutAccountsInput;
    disconnect?: ProfileWhereInput;
    delete?: ProfileWhereInput;
    connect?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
    update?: ProfileUpdateToOneWithWhereWithoutAccountsInput;
}
