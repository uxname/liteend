import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionCreateManyAccountInput } from './account-session-create-many-account.input';
import { Type } from 'class-transformer';

@InputType()
export class AccountSessionCreateManyAccountInputEnvelope {

    @Field(() => [AccountSessionCreateManyAccountInput], {nullable:false})
    @Type(() => AccountSessionCreateManyAccountInput)
    data!: Array<AccountSessionCreateManyAccountInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
