import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class TagService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const postsString = Array.isArray(createTagDto.posts)
        ? createTagDto.posts.join(',')
        : createTagDto.posts;

      const tagRef = await this.firebaseService
        .getFirestore()
        .collection('tags')
        .add({
          ...createTagDto,
          posts: postsString,
        });

      return {
        status: HttpStatus.CREATED,
        timeStamp: new Date().toISOString(),
        message: 'Tag created successfully',
        data: {
          id: tagRef.id,
          ...createTagDto,
          posts: postsString,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to create tag',
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
        .collection('tags')
        .get();

      const tags = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (tags.length === 0) {
        return {
          status: HttpStatus.NO_CONTENT,
          timeStamp: new Date().toISOString(),
          message: 'No tags found',
          data: [],
        };
      }

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Posts retrieved successfully',
        data: tags,
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
      const tagRef = this.firebaseService
        .getFirestore()
        .collection('tags')
        .doc(id);

      const doc = await tagRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Tag not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Tag retrieved successfully',
        data: { id: doc.id, ...doc.data() },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to retrieve tag',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tagRef = this.firebaseService
        .getFirestore()
        .collection('tags')
        .doc(id);

      const doc = await tagRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Tag not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const postsString = Array.isArray(updateTagDto.posts)
        ? updateTagDto.posts.join(',')
        : updateTagDto.posts;

      const dataToUpdate = {
        ...updateTagDto,
        posts: postsString,
      };

      await tagRef.update(dataToUpdate);

      const updatedDoc = await tagRef.get();

      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Tag updated successfully',
        data: { id: updatedDoc.id, ...updatedDoc.data() },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to update tag',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const tagRef = this.firebaseService
        .getFirestore()
        .collection('tags')
        .doc(id);
      const doc = await tagRef.get();

      if (!doc.exists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            timeStamp: new Date().toISOString(),
            message: 'Tag not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await tagRef.delete();
      return {
        status: HttpStatus.OK,
        timeStamp: new Date().toISOString(),
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timeStamp: new Date().toISOString(),
          message: 'Failed to delete tag',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
