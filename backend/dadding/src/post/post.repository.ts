import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository {
  constructor(private firebaseService: FirebaseService) {}

  async create(post: Post): Promise<string> {
    const postRef = await this.firebaseService
      .getFirestore()
      .collection('posts')
      .add(post);
    return postRef.id;
  }

  async findAll(): Promise<Post[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('posts')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Post);
  }

  async findOne(id: string): Promise<Post | null> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('posts')
      .doc(id)
      .get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Post) : null;
  }

  async update(id: string, post: Partial<Post>): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('posts')
      .doc(id)
      .update(post);
  }

  async remove(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('posts')
      .doc(id)
      .delete();
  }
}
