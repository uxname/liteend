import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
export declare class DeleteOneProfileArgs {
    where: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
}
