import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class GenerateEmailCodeInput {
  @Field()
  @IsEmail()
  email: string;
}
