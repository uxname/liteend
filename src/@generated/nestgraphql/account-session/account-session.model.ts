import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { Account } from '../account/account.model';

@ObjectType()
export class AccountSession {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Int, {nullable:false})
    accountId!: number;

    @HideField()
    token!: string;

    @Field(() => String, {nullable:false})
    ipAddr!: string;

    @Field(() => String, {nullable:true})
    userAgent!: string | null;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date;

    @Field(() => Account, {nullable:false})
    account?: Account;
}
