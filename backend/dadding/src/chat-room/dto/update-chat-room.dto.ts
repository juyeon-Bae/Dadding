import { PartialType } from '@nestjs/mapped-types';
import { CreateChatRoomDto } from './create-chat-room.dto';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
  @IsString()
  lastMessage: string;

  @IsDate()
  @Type(() => Date)
  lastMessageTime: Date;

  @IsString()
  target: string;
}
