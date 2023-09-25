import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileWhereInput } from './profile-where.input';
import { Type } from 'class-transformer';
import { ProfileUpdateWithoutAccountsInput } from './profile-update-without-accounts.input';

@InputType()
export class ProfileUpdateToOneWithWhereWithoutAccountsInput {

    @Field(() => ProfileWhereInput, {nullable:true})
    @Type(() => ProfileWhereInput)
    where?: ProfileWhereInput;

    @Field(() => ProfileUpdateWithoutAccountsInput, {nullable:false})
    @Type(() => ProfileUpdateWithoutAccountsInput)
    data!: ProfileUpdateWithoutAccountsInput;
}
