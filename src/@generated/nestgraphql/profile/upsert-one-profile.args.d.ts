import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileCreateInput } from './profile-create.input';
import { ProfileUpdateInput } from './profile-update.input';
export declare class UpsertOneProfileArgs {
    where: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
    create: ProfileCreateInput;
    update: ProfileUpdateInput;
}
