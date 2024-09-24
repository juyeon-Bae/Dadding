import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FirebaseModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
