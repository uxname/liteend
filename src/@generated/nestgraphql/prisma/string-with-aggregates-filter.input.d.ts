import { QueryMode } from './query-mode.enum';
import { NestedStringWithAggregatesFilter } from './nested-string-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedStringFilter } from './nested-string-filter.input';
export declare class StringWithAggregatesFilter {
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
    not?: NestedStringWithAggregatesFilter;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
}
