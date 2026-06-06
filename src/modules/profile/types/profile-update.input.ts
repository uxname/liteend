import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  avatarUrl: z
    .url({ message: 'Avatar URL must be a valid URL' })
    .max(2048, { message: 'Avatar URL must not exceed 2048 characters' })
    .trim()
    .optional(),
  displayName: z
    .string()
    .trim()
    .min(1, { message: 'Display name must not be empty' })
    .max(80, { message: 'Display name must not exceed 80 characters' })
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, { message: 'Bio must not exceed 500 characters' })
    .optional(),
});

class ProfileUpdateZodDto extends createZodDto(ProfileUpdateSchema) {}

@InputType({ description: 'Input fields for updating a user profile' })
export class ProfileUpdateInput extends ProfileUpdateZodDto {
  @Field(() => String, { nullable: true, description: 'New avatar image URL' })
  declare avatarUrl?: string;

  @Field(() => String, {
    nullable: true,
    description: 'New public display name',
  })
  declare displayName?: string;

  @Field(() => String, { nullable: true, description: 'New short biography' })
  declare bio?: string;
}
