import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagRepository {
  constructor(private firebaseService: FirebaseService) {}

  async create(tag: Tag): Promise<string> {
    const tagRef = await this.firebaseService
      .getFirestore()
      .collection('tags')
      .add(tag);
    return tagRef.id;
  }

  async findAll(): Promise<Tag[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('tags')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Tag);
  }

  async findOne(id: string): Promise<Tag | null> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('tags')
      .doc(id)
      .get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Tag) : null;
  }

  async update(id: string, tag: Partial<Tag>): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('tags')
      .doc(id)
      .update(tag);
  }

  async remove(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('tags')
      .doc(id)
      .delete();
  }
}
