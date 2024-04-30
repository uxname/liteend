import { QueryMode } from './query-mode.enum';
import { NestedStringNullableWithAggregatesFilter } from './nested-string-nullable-with-aggregates-filter.input';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedStringNullableFilter } from './nested-string-nullable-filter.input';
export declare class StringNullableWithAggregatesFilter {
    equals?: string;
    in?: Array<string>;
    notIn?: Array<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: keyof typeof QueryMode;
    not?: NestedStringNullableWithAggregatesFilter;
    _count?: NestedIntNullableFilter;
    _min?: NestedStringNullableFilter;
    _max?: NestedStringNullableFilter;
}
