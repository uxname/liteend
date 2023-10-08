import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileRole } from '../prisma/profile-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
import { AccountUpdateManyWithoutProfileNestedInput } from '../account/account-update-many-without-profile-nested.input';

@InputType()
export class ProfileUpdateInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => [ProfileRole], {nullable:true})
    roles?: Array<keyof typeof ProfileRole>;

    @Field(() => AccountStatus, {nullable:true})
    status?: keyof typeof AccountStatus;

    @Field(() => String, {nullable:true})
    avatarUrl?: string;

    @Field(() => String, {nullable:true})
    name?: string;

    @Field(() => String, {nullable:true})
    bio?: string;

    @Field(() => Boolean, {nullable:true})
    totpEnabled?: boolean;

    @Field(() => String, {nullable:true})
    totpSecret?: string;

    @Field(() => AccountUpdateManyWithoutProfileNestedInput, {nullable:true})
    accounts?: AccountUpdateManyWithoutProfileNestedInput;
}
