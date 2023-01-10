import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';

import { CreateChatUserDto } from './dto/create-chat-user.dto';
import { UpdateChatUserDto } from './dto/update-chat-user.dto';
import { ChatUserService } from './chat-user.service';

@Controller('chat_users')
export class ChatUserController {
	constructor(private readonly chatUserService: ChatUserService) {}

	@Post()
	create(@Body() createChatUserDto: CreateChatUserDto) {
		return this.chatUserService.create(createChatUserDto);
	}

	@Get()
	findAll() {
		return this.chatUserService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatUserService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateChatUserDto: UpdateChatUserDto,
	) {
		return this.chatUserService.update(+id, updateChatUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.chatUserService.remove(+id);
	}
}
