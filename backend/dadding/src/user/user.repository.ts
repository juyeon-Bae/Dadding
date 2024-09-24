import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private firebaseService: FirebaseService) {}

  async create(user: User): Promise<string> {
    const userRef = await this.firebaseService
      .getFirestore()
      .collection('users')
      .add(user);
    return userRef.id;
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('users')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User);
  }

  async findOne(id: string): Promise<User | null> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('users')
      .doc(id)
      .get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null;
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('users')
      .doc(id)
      .update(user);
  }

  async remove(id: string): Promise<void> {
    await this.firebaseService
      .getFirestore()
      .collection('users')
      .doc(id)
      .delete();
  }
}
