import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { AppRepository } from 'src/app.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ChatRoom } from './entities/chat-room.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [ChatRoomController],
  providers: [
    ChatRoomService,
    ResponseStrategy,
    {
      provide: 'CHAT_ROOM_COLLECTION',
      useValue: 'chatRoom',
    },
    {
      provide: 'CHAT_ROOM_REPOSITORY',
      useFactory: (firebaseService: FirebaseService, collection: string) => {
        return new AppRepository<ChatRoom>(firebaseService, collection);
      },
      inject: [FirebaseService, 'CHAT_ROOM_COLLECTION'],
    },
  ],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
