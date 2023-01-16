import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountRole } from '../prisma/account-role.enum';

@InputType()
export class AccountUpdaterolesInput {

    @Field(() => [AccountRole], {nullable:true})
    set?: Array<keyof typeof AccountRole>;

    @Field(() => [AccountRole], {nullable:true})
    push?: Array<keyof typeof AccountRole>;
}
