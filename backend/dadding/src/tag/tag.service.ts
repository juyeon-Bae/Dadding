import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';
import { Tag } from './entities/tag.entity';
import { ResponseStrategy } from '../shared/strategies/response.strategy';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private responseStrategy: ResponseStrategy,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag: Tag = {
        ...createTagDto,
        posts: this.formatPosts(createTagDto.posts),
      };
      const id = await this.tagRepository.create(tag);
      return this.responseStrategy.success('Tag created successfully', {
        id,
        ...tag,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to create tag', error);
    }
  }

  async findAll() {
    try {
      const tags = await this.tagRepository.findAll();
      return tags.length === 0
        ? this.responseStrategy.noContent('No tags found')
        : this.responseStrategy.success('Tags retrieved successfully', tags);
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve tags', error);
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.tagRepository.findOne(id);
      return tag
        ? this.responseStrategy.success('Tag retrieved successfully', tag)
        : this.responseStrategy.notFound('Tag not found');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve tag', error);
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const existingTag = await this.tagRepository.findOne(id);
      if (!existingTag) {
        return this.responseStrategy.notFound('Tag not found');
      }
      const updatedTag: Partial<Tag> = {
        ...updateTagDto,
        posts: this.formatPosts(updateTagDto.posts),
      };
      await this.tagRepository.update(id, updatedTag);
      return this.responseStrategy.success('Tag updated successfully', {
        id,
        ...existingTag,
        ...updatedTag,
      });
    } catch (error) {
      return this.responseStrategy.error('Failed to update tag', error);
    }
  }

  async remove(id: string) {
    try {
      const existingTag = await this.tagRepository.findOne(id);
      if (!existingTag) {
        return this.responseStrategy.notFound('Tag not found');
      }
      await this.tagRepository.remove(id);
      return this.responseStrategy.success('Tag deleted successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to delete tag', error);
    }
  }

  private formatPosts(posts: string | string[]): string {
    return Array.isArray(posts) ? posts.join(',') : posts;
  }
}
