import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsString()
  name: string;

  @IsNumber()
  postCount: number;

  @IsArray()
  posts: Array<string>;
}
