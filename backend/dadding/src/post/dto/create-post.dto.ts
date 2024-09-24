import { IsArray, IsInt, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  authorId: string;
  @IsString()
  content: string;
  @IsInt()
  commentCount: number;
  @IsInt()
  likeCount: number;
  @IsArray()
  likedBy: Array<string>;
  @IsString()
  title: string;
  @IsArray()
  tags: Array<string>;
}
