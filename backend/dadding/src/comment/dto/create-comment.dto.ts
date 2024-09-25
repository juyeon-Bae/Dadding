import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  userUid: string;

  @IsString()
  content: string;
}
