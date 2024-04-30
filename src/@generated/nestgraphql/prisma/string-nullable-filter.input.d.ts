import { QueryMode } from './query-mode.enum';
import { NestedStringNullableFilter } from './nested-string-nullable-filter.input';
export declare class StringNullableFilter {
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
    not?: NestedStringNullableFilter;
}
