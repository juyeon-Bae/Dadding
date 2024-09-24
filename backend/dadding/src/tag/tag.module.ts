import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TagRepository } from './tag.repository';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';

@Module({
  imports: [FirebaseModule],
  controllers: [TagController],
  providers: [TagService, TagRepository, ResponseStrategy],
})
export class TagModule {}
