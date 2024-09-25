import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto, id);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Get(':id/:messageId')
  findOneByMessageId(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.findOneByMessageId(id, messageId);
  }

  @Patch(':id/:messageId')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.update(id, updateMessageDto, messageId);
  }

  @Delete(':id/')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }

  @Delete(':id/:messageId')
  removeByMessageId(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.removeByMessageId(id, messageId);
  }
}
