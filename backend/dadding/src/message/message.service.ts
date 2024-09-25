import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './message.repository';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Message, MessageData } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private responseStrategy: ResponseStrategy,
    private firebaseService: FirebaseService,
  ) {}

  private encodeMessages(messages: MessageData[]): string {
    return Buffer.from(JSON.stringify(messages)).toString('base64');
  }

  private decodeMessages(encodedString: string): MessageData[] {
    try {
      return JSON.parse(Buffer.from(encodedString, 'base64').toString());
    } catch (error) {
      console.error('Error decoding messages:', error);
      return [];
    }
  }

  private async getUpdatedMessage(
    documentId: string,
    updatedMessages: MessageData[],
  ): Promise<Partial<Message>> {
    return { messages: this.encodeMessages(updatedMessages) };
  }

  async create(createMessageDto: CreateMessageDto, documentId: string) {
    try {
      const newMessageId = this.firebaseService
        .getFirestore()
        .collection('messages')
        .doc().id;
      const existingMessage = await this.messageRepository.findOne(documentId);
      const messages = existingMessage
        ? this.decodeMessages(existingMessage.messages)
        : [];

      const newMessage: MessageData = {
        ...createMessageDto,
        id: newMessageId,
        createdAt: new Date(),
        updatedAt: null,
      };

      const updatedMessage: Message = {
        messages: this.encodeMessages([...messages, newMessage]),
      };

      await this.messageRepository.create(updatedMessage, documentId);
      return this.responseStrategy.success('Message created successfully', {
        documentId,
        ...updatedMessage,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to create message', error);
    }
  }

  async findAll() {
    try {
      const messages = await this.messageRepository.findAll();
      if (messages.length === 0) {
        return this.responseStrategy.noContent('No messages found');
      }
      const decodedMessages = messages.map((message) =>
        this.decodeMessages(message.messages),
      );
      return this.responseStrategy.success(
        'Messages retrieved successfully',
        decodedMessages,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve messages', error);
    }
  }

  async findOne(documentId: string) {
    try {
      const message = await this.messageRepository.findOne(documentId);
      if (!message) {
        return this.responseStrategy.notFound('Message not found');
      }
      const decodedMessages = this.decodeMessages(message.messages);
      return this.responseStrategy.success(
        'Message retrieved successfully',
        decodedMessages,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve message', error);
    }
  }

  async findOneByMessageId(documentId: string, messageId: string) {
    try {
      const message = await this.messageRepository.findOne(documentId);
      if (!message) {
        return this.responseStrategy.notFound('Message not found');
      }
      const decodedMessages = this.decodeMessages(message.messages);
      const foundMessage = decodedMessages.find((c) => c.id === messageId);
      if (!foundMessage) {
        return this.responseStrategy.notFound('Message not found');
      }
      return this.responseStrategy.success(
        'Message retrieved successfully',
        foundMessage,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve message', error);
    }
  }

  async update(
    documentId: string,
    updateMessageDto: UpdateMessageDto,
    messageId: string,
  ) {
    try {
      const existingMessage = await this.messageRepository.findOne(documentId);
      if (!existingMessage) {
        return this.responseStrategy.notFound('Message not found');
      }

      const updatedMessages = this.decodeMessages(existingMessage.messages).map(
        (message) =>
          message.id === messageId
            ? { ...message, ...updateMessageDto, updatedAt: new Date() }
            : message,
      );

      const updatedMessage = await this.getUpdatedMessage(
        documentId,
        updatedMessages,
      );
      await this.messageRepository.update(documentId, updatedMessage);

      return this.responseStrategy.success('Message updated successfully', {
        id: documentId,
        ...existingMessage,
        ...updatedMessage,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update message', error);
    }
  }

  async remove(documentId: string) {
    try {
      const existingMessage = await this.messageRepository.findOne(documentId);
      if (!existingMessage) {
        return this.responseStrategy.notFound('Message not found');
      }
      await this.messageRepository.remove(documentId);
      return this.responseStrategy.success('Message deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete Message', error);
    }
  }

  async removeByMessageId(documentId: string, messageId: string) {
    try {
      const existingMessage = await this.messageRepository.findOne(documentId);
      if (!existingMessage) {
        return this.responseStrategy.notFound('Message not found');
      }

      const messages = this.decodeMessages(existingMessage.messages);
      const updatedMessages = messages.filter(
        (message) => message.id !== messageId,
      );

      if (updatedMessages.length === messages.length) {
        return this.responseStrategy.notFound('Message not found');
      }

      if (updatedMessages.length === 0) {
        await this.messageRepository.remove(documentId);
      } else {
        const updatedMessage = await this.getUpdatedMessage(
          documentId,
          updatedMessages,
        );
        await this.messageRepository.update(documentId, updatedMessage);
      }

      return this.responseStrategy.success('Message deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete message', error);
    }
  }
}
