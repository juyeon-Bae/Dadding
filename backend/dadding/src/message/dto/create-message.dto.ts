import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  userUid: string;

  @IsString()
  content: string;
}
