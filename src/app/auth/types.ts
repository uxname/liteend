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

@InputType()
export class ActivateAccountInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  emailCode: string;

  @Field()
  newPassword: string;
}

@InputType()
export class GenerateEmailCodeInput {
  @Field()
  @IsEmail()
  email: string;
}
