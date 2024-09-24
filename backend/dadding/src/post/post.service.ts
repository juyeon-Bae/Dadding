import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class PostService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const likedByString = Array.isArray(createPostDto.likedBy)
        ? createPostDto.likedBy.join(',')
        : createPostDto.likedBy;

      const currentTimestamp = new Date();

      const postRef = await this.firebaseService
        .getFirestore()
        .collection('posts')
        .add({
          ...createPostDto,
          likedBy: likedByString,
          createdAt: currentTimestamp,
          updatedAt: null,
        });

      return {
        status: HttpStatus.CREATED,
        timeStamp: new Date().toISOString(),
        message: 'Post created successfully',
        data: {
          id: postRef.id,
          ...createPostDto,
          likedBy: likedByString,
          createdAt: currentTimestamp,
          updatedAt: null,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to create post',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const snapshot = await this.firebaseService
        .getFirestore()
        .collection('posts')
        .get();

      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (posts.length === 0) {
        return {
          status: HttpStatus.NO_CONTENT,
          timeStamp: new Date().toISOString(),
          message: 'No posts found',
          data: [],
        };
      }

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Posts retrieved successfully',
        data: posts,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to retrieve posts',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const postRef = this.firebaseService
        .getFirestore()
        .collection('posts')
        .doc(id);

      const doc = await postRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Post not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Post retrieved successfully',
        data: { id: doc.id, ...doc.data() },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to retrieve post',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const postRef = this.firebaseService
        .getFirestore()
        .collection('posts')
        .doc(id);

      const doc = await postRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Post not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const likedByString = Array.isArray(updatePostDto.likedBy)
        ? updatePostDto.likedBy.join(',')
        : updatePostDto.likedBy;

      const currentTimestamp = new Date();
      const dataToUpdate = {
        ...updatePostDto,
        likedBy: likedByString,
        updatedAt: currentTimestamp,
      };

      await postRef.update(dataToUpdate);

      const updatedDoc = await postRef.get();

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Post updated successfully',
        data: { id: updatedDoc.id, ...updatedDoc.data() },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to update post',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const postRef = this.firebaseService
        .getFirestore()
        .collection('posts')
        .doc(id);
      const doc = await postRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Post not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await postRef.delete();
      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to delete post',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
