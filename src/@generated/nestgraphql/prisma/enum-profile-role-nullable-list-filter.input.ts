import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileRole } from './profile-role.enum';

@InputType()
export class EnumProfileRoleNullableListFilter {

    @Field(() => [ProfileRole], {nullable:true})
    equals?: Array<keyof typeof ProfileRole>;

    @Field(() => ProfileRole, {nullable:true})
    has?: keyof typeof ProfileRole;

    @Field(() => [ProfileRole], {nullable:true})
    hasEvery?: Array<keyof typeof ProfileRole>;

    @Field(() => [ProfileRole], {nullable:true})
    hasSome?: Array<keyof typeof ProfileRole>;

    @Field(() => Boolean, {nullable:true})
    isEmpty?: boolean;
}
