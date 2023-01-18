import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post()
	create(@Body() createChatDto: CreateChatDto) {
		return this.chatService.create(createChatDto);
	}

	@Get()
	findAll() {
		return this.chatService.findAll({ relations: { users: true } });
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body() updateChatDto: UpdateChatDto) {
		// get chatroom by id
		// validate old_password == password in database
		// if passwords do not match, throw error
		// password = new_password
		return this.chatService.update(id, updateChatDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.chatService.remove(id);
	}
}
