import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [ChatRoomModule, MessageModule, UserModule, FirebaseModule],
  providers: [ChatGateway],
})
export class ChatModule {}
