import { Injectable } from '@nestjs/common';
import { ResponseStrategy } from '../shared/strategies/response.strategy';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './comment.repository';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private responseStrategy: ResponseStrategy,
    private firebaseService: FirebaseService,
  ) {}

  private encodeArray(array: any[]): string {
    return btoa(JSON.stringify(array));
  }

  private decodeArray(encodedString: string): any[] {
    try {
      return JSON.parse(atob(encodedString));
    } catch (error) {
      console.error('Error decoding string:', error);
      return [];
    }
  }

  private async getUpdatedComment(
    id: string,
    updatedComments: Comment[],
  ): Promise<Partial<Comment>> {
    return {
      comments: this.encodeArray(updatedComments),
    };
  }

  async create(createCommentDto: CreateCommentDto, documentId: string) {
    try {
      const newCommentId = this.firebaseService
        .getFirestore()
        .collection('comments')
        .doc().id;

      const existingComment = await this.commentRepository.findOne(documentId);
      const initialComments = existingComment
        ? this.decodeArray(existingComment.comments)
        : [];

      const newComment = {
        ...createCommentDto,
        id: newCommentId,
        createdAt: new Date(),
        updatedAt: null,
      };

      const comment: Comment = {
        comments: this.encodeArray([...initialComments, newComment]),
      };

      await this.commentRepository.create(comment, documentId);
      return this.responseStrategy.success('Comment created successfully', {
        documentId,
        ...comment,
      });
    } catch (error) {
      console.error(error);
      return this.responseStrategy.error('Failed to create comment', error);
    }
  }

  async findAll() {
    try {
      const comments = await this.commentRepository.findAll();
      return comments.length === 0
        ? this.responseStrategy.noContent('No comments found')
        : this.responseStrategy.success(
            'Comments retrieved successfully',
            comments.map((comment) => this.decodeArray(comment.comments)),
          );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comments', error);
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.commentRepository.findOne(id);
      return comment
        ? this.responseStrategy.success(
            'Comment retrieved successfully',
            this.decodeArray(comment.comments),
          )
        : this.responseStrategy.notFound('Comment not found');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comment', error);
    }
  }

  async findOneByCommentId(id: string, commentId: string) {
    try {
      const existingComment = await this.commentRepository.findOne(id);
      const comment = await this.commentRepository.findOne(id);
      return comment &&
        this.decodeArray(existingComment.comments).every(
          (comment) => comment.id === commentId,
        )
        ? this.responseStrategy.success(
            'Comment retrieved successfully',
            this.decodeArray(comment.comments).filter(
              (comment) => comment.id === commentId,
            ),
          )
        : this.responseStrategy.notFound('Comment not found');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comment', error);
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    commentId: string,
  ) {
    try {
      const existingComment = await this.commentRepository.findOne(id);
      if (!existingComment) {
        return this.responseStrategy.notFound('Comment not found');
      }

      const updatedComments = this.decodeArray(existingComment.comments).map(
        (comment) =>
          comment.id === commentId
            ? { ...comment, ...updateCommentDto, updatedAt: new Date() }
            : comment,
      );

      const updatedComment = await this.getUpdatedComment(id, updatedComments);

      await this.commentRepository.update(id, updatedComment);
      return this.responseStrategy.success('Comment updated successfully', {
        id,
        ...existingComment,
        ...updatedComment,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update comment', error);
    }
  }

  async remove(id: string) {
    try {
      const existingComment = await this.commentRepository.findOne(id);
      if (!existingComment) {
        return this.responseStrategy.notFound('Comment not found');
      }
      await this.commentRepository.remove(id);
      return this.responseStrategy.success('Comment deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete Comment', error);
    }
  }

  async removeByCommentId(id: string, commentId: string) {
    try {
      const existingComment = await this.commentRepository.findOne(id);
      if (
        !existingComment ||
        this.decodeArray(existingComment.comments).every(
          (comment) => comment.id !== commentId,
        )
      ) {
        return this.responseStrategy.notFound('Comment not found');
      }

      const updatedComments = this.decodeArray(existingComment.comments).filter(
        (comment) => comment.id !== commentId,
      );

      if (updatedComments.length === 0) {
        await this.commentRepository.remove(id);
      } else {
        const updatedComment = await this.getUpdatedComment(
          id,
          updatedComments,
        );
        await this.commentRepository.update(id, updatedComment);
      }

      return this.responseStrategy.success('Comment deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete comment', error);
    }
  }
}
