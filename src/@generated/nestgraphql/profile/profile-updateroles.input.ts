import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileRole } from '../prisma/profile-role.enum';

@InputType()
export class ProfileUpdaterolesInput {

    @Field(() => [ProfileRole], {nullable:true})
    set?: Array<keyof typeof ProfileRole>;

    @Field(() => [ProfileRole], {nullable:true})
    push?: Array<keyof typeof ProfileRole>;
}
