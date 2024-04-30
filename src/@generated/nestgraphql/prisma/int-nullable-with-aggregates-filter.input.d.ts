import { NestedIntNullableWithAggregatesFilter } from './nested-int-nullable-with-aggregates-filter.input';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedFloatNullableFilter } from './nested-float-nullable-filter.input';
export declare class IntNullableWithAggregatesFilter {
    equals?: number;
    in?: Array<number>;
    notIn?: Array<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntNullableWithAggregatesFilter;
    _count?: NestedIntNullableFilter;
    _avg?: NestedFloatNullableFilter;
    _sum?: NestedIntNullableFilter;
    _min?: NestedIntNullableFilter;
    _max?: NestedIntNullableFilter;
}
