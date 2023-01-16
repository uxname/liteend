import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountRole } from '../prisma/account-role.enum';

@InputType()
export class AccountCreaterolesInput {

    @Field(() => [AccountRole], {nullable:false})
    set!: Array<keyof typeof AccountRole>;
}
