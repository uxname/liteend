import { NestedBoolWithAggregatesFilter } from './nested-bool-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedBoolFilter } from './nested-bool-filter.input';
export declare class BoolWithAggregatesFilter {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
}
