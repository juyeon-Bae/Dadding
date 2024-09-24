import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  description: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsArray()
  posts: Array<string>;

  @IsString()
  profilePicture: string;
}
