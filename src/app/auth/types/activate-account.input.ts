import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ActivateAccountInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string;
}
