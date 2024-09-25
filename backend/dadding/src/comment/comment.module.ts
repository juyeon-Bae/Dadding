import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [FirebaseModule],
  controllers: [CommentController],
  providers: [CommentService, ResponseStrategy, CommentRepository],
})
export class CommentModule {}
