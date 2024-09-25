import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ResponseStrategy } from '../shared/strategies/response.strategy';
import { AppRepository } from 'src/app.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Post } from './entities/post.entity';

@Module({
  imports: [FirebaseModule],
  controllers: [PostController],
  providers: [
    PostService,
    ResponseStrategy,
    {
      provide: 'POST_COLLECTION',
      useValue: 'post',
    },
    {
      provide: 'POST_REPOSITORY',
      useFactory: (firebaseService: FirebaseService, collection: string) => {
        return new AppRepository<Post>(firebaseService, collection);
      },
      inject: [FirebaseService, 'POST_COLLECTION'],
    },
  ],
  exports: [PostService],
})
export class PostModule {}
