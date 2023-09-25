import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileUpdateWithoutAccountsInput } from './profile-update-without-accounts.input';
import { Type } from 'class-transformer';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { ProfileWhereInput } from './profile-where.input';

@InputType()
export class ProfileUpsertWithoutAccountsInput {

    @Field(() => ProfileUpdateWithoutAccountsInput, {nullable:false})
    @Type(() => ProfileUpdateWithoutAccountsInput)
    update!: ProfileUpdateWithoutAccountsInput;

    @Field(() => ProfileCreateWithoutAccountsInput, {nullable:false})
    @Type(() => ProfileCreateWithoutAccountsInput)
    create!: ProfileCreateWithoutAccountsInput;

    @Field(() => ProfileWhereInput, {nullable:true})
    @Type(() => ProfileWhereInput)
    where?: ProfileWhereInput;
}
