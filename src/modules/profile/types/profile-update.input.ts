import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  avatarUrl: z.url({ message: 'Avatar URL must be a valid URL' }).optional(),
});

class ProfileUpdateZodDto extends createZodDto(ProfileUpdateSchema) {}

@InputType()
export class ProfileUpdateInput extends ProfileUpdateZodDto {
  @Field(() => String, { nullable: true })
  declare avatarUrl?: string;
}
