import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { ProfileRole } from '../prisma/profile-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
import { HideField } from '@nestjs/graphql';
import { Account } from '../account/account.model';
import { ProfileCount } from './profile-count.output';

@ObjectType()
export class Profile {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [ProfileRole], {nullable:true})
    roles!: Array<keyof typeof ProfileRole>;

    @Field(() => AccountStatus, {nullable:false})
    status!: keyof typeof AccountStatus;

    @Field(() => String, {nullable:true})
    avatarUrl!: string | null;

    @Field(() => String, {nullable:true})
    name!: string | null;

    @Field(() => String, {nullable:true})
    bio!: string | null;

    @Field(() => Boolean, {nullable:false,defaultValue:false})
    totpEnabled!: boolean;

    @HideField()
    totpSecret!: string | null;

    @Field(() => [Account], {nullable:true})
    accounts?: Array<Account>;

    @Field(() => ProfileCount, {nullable:false})
    _count?: ProfileCount;
}
