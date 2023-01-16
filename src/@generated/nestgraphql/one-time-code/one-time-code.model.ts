import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class OneTimeCode {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    code!: string;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date;
}
