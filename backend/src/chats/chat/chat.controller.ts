import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
	Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import * as bcrypt from 'bcrypt';
import { FindOptionsOrder } from 'typeorm';
import { ChatRelationsBodyDto } from './dto/chat-relations-body.dto';
import { ChatRelationsQueryDto } from './dto/chat-relations-query.dto';

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	private readonly defaultRelationships = { has_users: true };
	private readonly defaultOrder: FindOptionsOrder<Chat> = {
		name: 'ASC',
		messages: {
			created_at: 'ASC',
		},
	};

	@Post()
	async create(@Body() createChatDto: CreateChatDto) {
		if (createChatDto.hasOwnProperty('password')) {
			const hashed = await bcrypt.hash(createChatDto.password, 11);
			createChatDto.password = hashed;
		}
		return this.chatService.insert(createChatDto);
	}

	@Get()
	findAll(
		@Query() userRelationsQuery?: ChatRelationsQueryDto,
		@Body() userRelationsBody?: ChatRelationsBodyDto,
	) {
		const userRelationsDto = Object.keys(userRelationsBody ?? {}).length
			? userRelationsBody
			: Object.keys(userRelationsQuery ?? {}).length
			? userRelationsQuery
			: this.defaultRelationships;

		return this.chatService.findAll({
			relations: userRelationsDto,
			order: this.defaultOrder,
		});
	}

	@Get(':id')
	findOne(
		@Param('id') id: number,
		@Query() userRelationsQuery?: ChatRelationsQueryDto,
		@Body() userRelationsBody?: ChatRelationsBodyDto,
	) {
		const userRelationsDto = Object.keys(userRelationsBody ?? {}).length
			? userRelationsBody
			: Object.keys(userRelationsQuery ?? {}).length
			? userRelationsQuery
			: this.defaultRelationships;

		return this.chatService.findOne({
			where: { id },
			relations: userRelationsDto,
			order: this.defaultOrder,
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
