import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountStatus } from './account-status.enum';
import { NestedEnumAccountStatusWithAggregatesFilter } from './nested-enum-account-status-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumAccountStatusFilter } from './nested-enum-account-status-filter.input';

@InputType()
export class EnumAccountStatusWithAggregatesFilter {

    @Field(() => AccountStatus, {nullable:true})
    equals?: keyof typeof AccountStatus;

    @Field(() => [AccountStatus], {nullable:true})
    in?: Array<keyof typeof AccountStatus>;

    @Field(() => [AccountStatus], {nullable:true})
    notIn?: Array<keyof typeof AccountStatus>;

    @Field(() => NestedEnumAccountStatusWithAggregatesFilter, {nullable:true})
    not?: NestedEnumAccountStatusWithAggregatesFilter;

    @Field(() => NestedIntFilter, {nullable:true})
    _count?: NestedIntFilter;

    @Field(() => NestedEnumAccountStatusFilter, {nullable:true})
    _min?: NestedEnumAccountStatusFilter;

    @Field(() => NestedEnumAccountStatusFilter, {nullable:true})
    _max?: NestedEnumAccountStatusFilter;
}
