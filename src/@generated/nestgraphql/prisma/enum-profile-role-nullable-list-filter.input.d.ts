import { ProfileRole } from './profile-role.enum';
export declare class EnumProfileRoleNullableListFilter {
    equals?: Array<keyof typeof ProfileRole>;
    has?: keyof typeof ProfileRole;
    hasEvery?: Array<keyof typeof ProfileRole>;
    hasSome?: Array<keyof typeof ProfileRole>;
    isEmpty?: boolean;
}
