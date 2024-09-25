import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { AppRepository } from 'src/app.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [FirebaseModule],
  controllers: [TagController],
  providers: [
    TagService,
    ResponseStrategy,
    {
      provide: 'TAG_COLLECTION',
      useValue: 'tag',
    },
    {
      provide: 'TAG_REPOSITORY',
      useFactory: (firebaseService: FirebaseService, collection: string) => {
        return new AppRepository<Tag>(firebaseService, collection);
      },
      inject: [FirebaseService, 'TAG_COLLECTION'],
    },
  ],
  exports: [TagService],
})
export class TagModule {}
