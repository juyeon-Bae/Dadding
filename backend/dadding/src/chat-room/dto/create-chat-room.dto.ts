import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  lastMessage: string;

  @IsString()
  target: string;
}
