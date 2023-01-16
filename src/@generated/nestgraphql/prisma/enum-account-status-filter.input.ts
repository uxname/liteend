import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountStatus } from './account-status.enum';
import { NestedEnumAccountStatusFilter } from './nested-enum-account-status-filter.input';

@InputType()
export class EnumAccountStatusFilter {

    @Field(() => AccountStatus, {nullable:true})
    equals?: keyof typeof AccountStatus;

    @Field(() => [AccountStatus], {nullable:true})
    in?: Array<keyof typeof AccountStatus>;

    @Field(() => [AccountStatus], {nullable:true})
    notIn?: Array<keyof typeof AccountStatus>;

    @Field(() => NestedEnumAccountStatusFilter, {nullable:true})
    not?: NestedEnumAccountStatusFilter;
}
