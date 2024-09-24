import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { ResponseStrategy } from '../shared/strategies/response.strategy';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private responseStrategy: ResponseStrategy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user: User = {
        ...createUserDto,
        posts: this.formatPosts(createUserDto.posts),
        createdAt: new Date(),
      };
      const id = await this.userRepository.create(user);
      return this.responseStrategy.success('User created successfully', {
        id,
        ...user,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to create user', error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.findAll();
      return users.length === 0
        ? this.responseStrategy.noContent('No users found')
        : this.responseStrategy.success('Users retrieved successfully', users);
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve users', error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne(id);
      return user
        ? this.responseStrategy.success('User retrieved successfully', user)
        : this.responseStrategy.notFound('User not found');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve user', error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne(id);
      if (!existingUser) {
        return this.responseStrategy.notFound('User not found');
      }
      const updatedUser: Partial<User> = {
        ...updateUserDto,
        posts: this.formatPosts(updateUserDto.posts),
      };
      await this.userRepository.update(id, updatedUser);
      return this.responseStrategy.success('User updated successfully', {
        id,
        ...existingUser,
        ...updatedUser,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update user', error);
    }
  }

  async remove(id: string) {
    try {
      const existingUser = await this.userRepository.findOne(id);
      if (!existingUser) {
        return this.responseStrategy.notFound('User not found');
      }
      await this.userRepository.remove(id);
      return this.responseStrategy.success('User deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete user', error);
    }
  }

  private formatPosts(posts: string | string[]): string {
    return Array.isArray(posts) ? posts.join(',') : posts;
  }
}
