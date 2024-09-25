import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { MessageRepository } from './message.repository';

@Module({
  imports: [FirebaseModule],
  controllers: [MessageController],
  providers: [MessageService, ResponseStrategy, MessageRepository],
})
export class MessageModule {}
