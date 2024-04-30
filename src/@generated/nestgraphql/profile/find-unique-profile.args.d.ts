import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
export declare class FindUniqueProfileArgs {
    where: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
}
