import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
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
