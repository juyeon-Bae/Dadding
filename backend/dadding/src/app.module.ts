import { MiddlewareConsumer, Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyMiddleware } from './api-key.middleware';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    PostModule,
    TagModule,
    UserModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
