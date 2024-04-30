import { QueryMode } from './query-mode.enum';
import { NestedStringFilter } from './nested-string-filter.input';
export declare class StringFilter {
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
    not?: NestedStringFilter;
}
