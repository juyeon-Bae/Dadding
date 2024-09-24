import { MiddlewareConsumer, Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyMiddleware } from './api-key.middleware';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    FirebaseModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
