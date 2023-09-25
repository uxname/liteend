import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateManyProfileInput } from './account-create-many-profile.input';
import { Type } from 'class-transformer';

@InputType()
export class AccountCreateManyProfileInputEnvelope {

    @Field(() => [AccountCreateManyProfileInput], {nullable:false})
    @Type(() => AccountCreateManyProfileInput)
    data!: Array<AccountCreateManyProfileInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
