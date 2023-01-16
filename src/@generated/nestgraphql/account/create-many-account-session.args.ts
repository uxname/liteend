import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionCreateManyInput } from '../account-session/account-session-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyAccountSessionArgs {

    @Field(() => [AccountSessionCreateManyInput], {nullable:false})
    @Type(() => AccountSessionCreateManyInput)
    data!: Array<AccountSessionCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
