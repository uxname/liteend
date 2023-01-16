import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountRole } from './account-role.enum';

@InputType()
export class EnumAccountRoleNullableListFilter {

    @Field(() => [AccountRole], {nullable:true})
    equals?: Array<keyof typeof AccountRole>;

    @Field(() => AccountRole, {nullable:true})
    has?: keyof typeof AccountRole;

    @Field(() => [AccountRole], {nullable:true})
    hasEvery?: Array<keyof typeof AccountRole>;

    @Field(() => [AccountRole], {nullable:true})
    hasSome?: Array<keyof typeof AccountRole>;

    @Field(() => Boolean, {nullable:true})
    isEmpty?: boolean;
}
