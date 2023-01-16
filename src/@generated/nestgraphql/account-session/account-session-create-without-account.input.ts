import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class AccountSessionCreateWithoutAccountInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:false})
    token!: string;

    @Field(() => String, {nullable:false})
    ipAddr!: string;

    @Field(() => String, {nullable:true})
    userAgent?: string;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date | string;
}
