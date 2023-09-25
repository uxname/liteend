import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileRole } from '../prisma/profile-role.enum';

@InputType()
export class ProfileCreaterolesInput {

    @Field(() => [ProfileRole], {nullable:false})
    set!: Array<keyof typeof ProfileRole>;
}
