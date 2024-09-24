import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserRepository } from './user.repository';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ResponseStrategy],
})
export class UserModule {}
