import { Inject, Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { AppRepository } from 'src/app.repository';
import { ChatRoom } from './entities/chat-room.entity';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';

@Injectable()
export class ChatRoomService {
  constructor(
    @Inject('CHAT_ROOM_REPOSITORY')
    private chatRoomRepository: AppRepository<ChatRoom>,
    private responseStrategy: ResponseStrategy,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto) {
    try {
      const chatRoom: ChatRoom = {
        ...createChatRoomDto,
        lastMessageTime: null,
      };
      const id = await this.chatRoomRepository.create(chatRoom);
      return this.responseStrategy.success('ChatRoom created successfully', {
        id,
        ...chatRoom,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to create chatRoom', error);
    }
  }

  async findAll() {
    try {
      const chatRooms = await this.chatRoomRepository.findAll();
      return chatRooms.length === 0
        ? this.responseStrategy.noContent('No chatRooms found')
        : this.responseStrategy.success(
            'ChatRooms retrieved successfully',
            chatRooms,
          );
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve chatRooms', error);
    }
  }

  async findOne(id: string) {
    try {
      const chatRoom = await this.chatRoomRepository.findOne(id);
      return chatRoom
        ? this.responseStrategy.success(
            'ChatRoom retrieved successfully',
            chatRoom,
          )
        : this.responseStrategy.notFound('ChatRoom not found');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve chatRoom', error);
    }
  }

  async update(id: string, updateChatRoomDto: UpdateChatRoomDto) {
    try {
      const existingChatRoom = await this.chatRoomRepository.findOne(id);
      if (!existingChatRoom) {
        return this.responseStrategy.notFound('ChatRoom not found');
      }
      const updatedChatRoom: Partial<ChatRoom> = {
        ...updateChatRoomDto,
      };
      await this.chatRoomRepository.update(id, updatedChatRoom);
      return this.responseStrategy.success('ChatRoom updated successfully', {
        id,
        ...existingChatRoom,
        ...updatedChatRoom,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update chatRoom', error);
    }
  }

  async remove(id: string) {
    try {
      const existingChatRoom = await this.chatRoomRepository.findOne(id);
      if (!existingChatRoom) {
        return this.responseStrategy.notFound('ChatRoom not found');
      }
      await this.chatRoomRepository.remove(id);
      return this.responseStrategy.success('ChatRoom deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete chatRoom', error);
    }
  }
}
