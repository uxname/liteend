import { AccountStatus } from './account-status.enum';
export declare class NestedEnumAccountStatusFilter {
    equals?: keyof typeof AccountStatus;
    in?: Array<keyof typeof AccountStatus>;
    notIn?: Array<keyof typeof AccountStatus>;
    not?: NestedEnumAccountStatusFilter;
}
