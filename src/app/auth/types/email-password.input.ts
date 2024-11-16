import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class EmailPasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
