import { NestedIntFilter } from './nested-int-filter.input';
import { NestedBoolFilter } from './nested-bool-filter.input';
export declare class NestedBoolWithAggregatesFilter {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
}
