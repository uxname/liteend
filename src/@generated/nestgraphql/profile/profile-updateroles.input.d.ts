import { ProfileRole } from '../prisma/profile-role.enum';
export declare class ProfileUpdaterolesInput {
    set?: Array<keyof typeof ProfileRole>;
    push?: Array<keyof typeof ProfileRole>;
}
