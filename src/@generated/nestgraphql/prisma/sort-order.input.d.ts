import { SortOrder } from './sort-order.enum';
import { NullsOrder } from './nulls-order.enum';
export declare class SortOrderInput {
    sort: keyof typeof SortOrder;
    nulls?: keyof typeof NullsOrder;
}
