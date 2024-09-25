import { Injectable } from '@nestjs/common';
import { ResponseStrategy } from '../shared/strategies/response.strategy';
import { Comment, CommentData } from './entities/comment.entity';
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

  private encodeComments(comments: CommentData[]): string {
    return Buffer.from(JSON.stringify(comments)).toString('base64');
  }

  private decodeComments(encodedString: string): CommentData[] {
    try {
      return JSON.parse(Buffer.from(encodedString, 'base64').toString());
    } catch (error) {
      console.error('Error decoding comments:', error);
      return [];
    }
  }

  private async getUpdatedComment(
    documentId: string,
    updatedComments: CommentData[],
  ): Promise<Partial<Comment>> {
    return { comments: this.encodeComments(updatedComments) };
  }

  async create(createCommentDto: CreateCommentDto, documentId: string) {
    try {
      const newCommentId = this.firebaseService
        .getFirestore()
        .collection('comments')
        .doc().id;
      const existingComment = await this.commentRepository.findOne(documentId);
      const comments = existingComment
        ? this.decodeComments(existingComment.comments)
        : [];

      const newComment: CommentData = {
        ...createCommentDto,
        id: newCommentId,
        createdAt: new Date(),
        updatedAt: null,
      };

      const updatedComment: Comment = {
        comments: this.encodeComments([...comments, newComment]),
      };

      await this.commentRepository.create(updatedComment, documentId);
      return this.responseStrategy.success('Comment created successfully', {
        documentId,
        ...updatedComment,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to create comment', error);
    }
  }

  async findAll() {
    try {
      const comments = await this.commentRepository.findAll();
      if (comments.length === 0) {
        return this.responseStrategy.noContent('No comments found');
      }
      const decodedComments = comments.map((comment) =>
        this.decodeComments(comment.comments),
      );
      return this.responseStrategy.success(
        'Comments retrieved successfully',
        decodedComments,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comments', error);
    }
  }

  async findOne(documentId: string) {
    try {
      const comment = await this.commentRepository.findOne(documentId);
      if (!comment) {
        return this.responseStrategy.notFound('Comment not found');
      }
      const decodedComments = this.decodeComments(comment.comments);
      return this.responseStrategy.success(
        'Comment retrieved successfully',
        decodedComments,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comment', error);
    }
  }

  async findOneByCommentId(documentId: string, commentId: string) {
    try {
      const comment = await this.commentRepository.findOne(documentId);
      if (!comment) {
        return this.responseStrategy.notFound('Comment not found');
      }
      const decodedComments = this.decodeComments(comment.comments);
      const foundComment = decodedComments.find((c) => c.id === commentId);
      if (!foundComment) {
        return this.responseStrategy.notFound('Comment not found');
      }
      return this.responseStrategy.success(
        'Comment retrieved successfully',
        foundComment,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve comment', error);
    }
  }

  async update(
    documentId: string,
    updateCommentDto: UpdateCommentDto,
    commentId: string,
  ) {
    try {
      const existingComment = await this.commentRepository.findOne(documentId);
      if (!existingComment) {
        return this.responseStrategy.notFound('Comment not found');
      }

      const updatedComments = this.decodeComments(existingComment.comments).map(
        (comment) =>
          comment.id === commentId
            ? { ...comment, ...updateCommentDto, updatedAt: new Date() }
            : comment,
      );

      const updatedComment = await this.getUpdatedComment(
        documentId,
        updatedComments,
      );
      await this.commentRepository.update(documentId, updatedComment);

      return this.responseStrategy.success('Comment updated successfully', {
        id: documentId,
        ...existingComment,
        ...updatedComment,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update comment', error);
    }
  }

  async remove(documentId: string) {
    try {
      const existingComment = await this.commentRepository.findOne(documentId);
      if (!existingComment) {
        return this.responseStrategy.notFound('Comment not found');
      }
      await this.commentRepository.remove(documentId);
      return this.responseStrategy.success('Comment deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete Comment', error);
    }
  }

  async removeByCommentId(documentId: string, commentId: string) {
    try {
      const existingComment = await this.commentRepository.findOne(documentId);
      if (!existingComment) {
        return this.responseStrategy.notFound('Comment not found');
      }

      const comments = this.decodeComments(existingComment.comments);
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId,
      );

      if (updatedComments.length === comments.length) {
        return this.responseStrategy.notFound('Comment not found');
      }

      if (updatedComments.length === 0) {
        await this.commentRepository.remove(documentId);
      } else {
        const updatedComment = await this.getUpdatedComment(
          documentId,
          updatedComments,
        );
        await this.commentRepository.update(documentId, updatedComment);
      }

      return this.responseStrategy.success('Comment deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete comment', error);
    }
  }
}
