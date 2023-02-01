import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import * as bcrypt from 'bcrypt';

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post()
	async create(@Body() createChatDto: CreateChatDto) {
		if (createChatDto.hasOwnProperty('password')) {
			const hashed = await bcrypt.hash(createChatDto.password, 11);
			createChatDto.password = hashed;
		}
		return this.chatService.insert(createChatDto);
	}

	@Get()
	findAll() {
		return this.chatService.findAll({ relations: { has_users: true } });
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatService.findOne({
			where: { id },
			relations: { has_users: true },
		});
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChatDto: UpdateChatDto) {
		if (updateChatDto.hasOwnProperty('password')) {
			const current_Chat: Chat = await this.chatService.findOne({
				where: { id },
			});
			// check permissions
			if (
				!(await bcrypt.compare(current_Chat.password, updateChatDto.password))
			) {
				throw new BadRequestException('wrong password');
			}
			updateChatDto.password = updateChatDto.new_password;
		}

		return this.chatService.update(id, updateChatDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.chatService.remove(id);
	}
}
