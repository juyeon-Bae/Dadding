import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto, id);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Get(':id/:commentId')
  findOneByCommentId(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.findOneByCommentId(id, commentId);
  }

  @Patch(':id/:commentId')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.update(id, updateCommentDto, commentId);
  }

  @Delete(':id/:commentId')
  removeByCommentId(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.removeByCommentId(id, commentId);
  }

  @Delete(':id/')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
