import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PostRepository } from './post.repository';
import { ResponseStrategy } from '../shared/strategies/response.strategy';

@Module({
  imports: [FirebaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, ResponseStrategy],
})
export class PostModule {}
