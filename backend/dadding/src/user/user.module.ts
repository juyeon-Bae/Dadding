import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AppRepository } from 'src/app.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    ResponseStrategy,
    {
      provide: 'USER_COLLECTION',
      useValue: 'user',
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (firebaseService: FirebaseService, collection: string) => {
        return new AppRepository<User>(firebaseService, collection);
      },
      inject: [FirebaseService, 'USER_COLLECTION'],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
