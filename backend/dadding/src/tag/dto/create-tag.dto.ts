import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsNumber()
  postCount: number;

  @IsArray()
  posts: Array<string>;
}
