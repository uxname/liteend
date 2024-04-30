import { AccountStatus } from './account-status.enum';
import { NestedEnumAccountStatusFilter } from './nested-enum-account-status-filter.input';
export declare class EnumAccountStatusFilter {
    equals?: keyof typeof AccountStatus;
    in?: Array<keyof typeof AccountStatus>;
    notIn?: Array<keyof typeof AccountStatus>;
    not?: NestedEnumAccountStatusFilter;
}
