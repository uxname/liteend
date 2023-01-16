import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountStatus } from './account-status.enum';

@InputType()
export class NestedEnumAccountStatusFilter {

    @Field(() => AccountStatus, {nullable:true})
    equals?: keyof typeof AccountStatus;

    @Field(() => [AccountStatus], {nullable:true})
    in?: Array<keyof typeof AccountStatus>;

    @Field(() => [AccountStatus], {nullable:true})
    notIn?: Array<keyof typeof AccountStatus>;

    @Field(() => NestedEnumAccountStatusFilter, {nullable:true})
    not?: NestedEnumAccountStatusFilter;
}
