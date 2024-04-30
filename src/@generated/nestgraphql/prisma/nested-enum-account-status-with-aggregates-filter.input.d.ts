import { AccountStatus } from './account-status.enum';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumAccountStatusFilter } from './nested-enum-account-status-filter.input';
export declare class NestedEnumAccountStatusWithAggregatesFilter {
    equals?: keyof typeof AccountStatus;
    in?: Array<keyof typeof AccountStatus>;
    notIn?: Array<keyof typeof AccountStatus>;
    not?: NestedEnumAccountStatusWithAggregatesFilter;
    _count?: NestedIntFilter;
    _min?: NestedEnumAccountStatusFilter;
    _max?: NestedEnumAccountStatusFilter;
}
