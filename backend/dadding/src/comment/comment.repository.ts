import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(dto: Comment, id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('comments')
      .doc(id)
      .set(dto);
  }

  async findAll(): Promise<Comment[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('comments')
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Comment,
    );
  }

  async findOne(id: string): Promise<Comment | null> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('comments')
      .doc(id)
      .get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Comment) : null;
  }

  async update(id: string, post: Partial<Comment>): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('comments')
      .doc(id)
      .update(post);
  }

  async remove(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('comments')
      .doc(id)
      .delete();
  }
}
