import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(dto: Message, id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('messages')
      .doc(id)
      .set(dto);
  }

  async findAll(): Promise<Message[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('messages')
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Message,
    );
  }

  async findOne(id: string): Promise<Message | null> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('messages')
      .doc(id)
      .get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Message) : null;
  }

  async update(id: string, post: Partial<Message>): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('messages')
      .doc(id)
      .update(post);
  }

  async remove(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('messages')
      .doc(id)
      .delete();
  }
}
