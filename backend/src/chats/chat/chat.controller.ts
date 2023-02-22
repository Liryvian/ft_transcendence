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
import { DeleteResult, FindOptionsOrder } from 'typeorm';
import { ChatRelationsBodyDto } from './dto/chat-relations-body.dto';
import { ChatRelationsQueryDto } from './dto/chat-relations-query.dto';
import { MessageService } from '../message/message.service';
import { SocketService } from '../../socket/socket.service';
import {
	Chat_List_Item,
	Chat_Type,
	SocketMessage,
} from '../../socket/socket.types';
import { UserInChat } from '../../users/user/entities/user.entity';
import { ChatUserPermission } from '../chat-user-permissions/entities/chat-user-permission.entity';

@Controller('chats')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly messageService: MessageService,
		private readonly socketService: SocketService,
	) {}

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
		let hasUsers = false;
		if (createChatDto.hasOwnProperty('users')) {
			const users: UserInChat[] = createChatDto.users;
			hasUsers = true;
			delete createChatDto.users;
			// createChatDto['has_users'] = [] as ChatUserPermission[];
			console.log(users);
			return false;
		}
		const chat: Chat = await this.chatService.save(createChatDto);

		const socketMessage: SocketMessage<Chat_List_Item> = {
			action: 'new',
			data: {
				id: chat.id,
				name: chat.name,
				type: chat.type as Chat_Type,
			},
		};
		console.log('Before emit to backend');
		this.socketService.chatlist_emit('all', socketMessage);
		return chat;
	}

	@Get()
	findAll(
		@Query() chatRelationsQuery?: ChatRelationsQueryDto,
		@Body() chatRelationsBody?: ChatRelationsBodyDto,
	) {
		const chatRelationsDto = Object.keys(chatRelationsBody ?? {}).length
			? chatRelationsBody
			: Object.keys(chatRelationsQuery ?? {}).length
			? chatRelationsQuery
			: this.defaultRelationships;

		return this.chatService.findAll({
			relations: chatRelationsDto,
			order: this.defaultOrder,
		});
	}

	@Get(':id/messages')
	async chatMessages(@Param('id') id: number) {
		return await this.messageService.findAll({
			where: { chat: { id } },
		});
	}

	@Get(':id')
	findOne(
		@Param('id') id: number,
		@Query() chatRelationsQuery?: ChatRelationsQueryDto,
		@Body() chatRelationsBody?: ChatRelationsBodyDto,
	) {
		const chatRelationsDto = Object.keys(chatRelationsBody ?? {}).length
			? chatRelationsBody
			: Object.keys(chatRelationsQuery ?? {}).length
			? chatRelationsQuery
			: this.defaultRelationships;

		return this.chatService.findOne({
			where: { id },
			relations: chatRelationsDto,
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
		const chat = await this.chatService.save({
			id,
			...updateChatDto,
		});

		const socketMessage: SocketMessage<Chat_List_Item> = {
			action: 'update',
			data: {
				id: chat.id,
				name: chat.name,
				type: chat.type as Chat_Type,
			},
		};
		this.socketService.chatlist_emit('all', socketMessage);
		return chat;
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		const deleteResult: DeleteResult = await this.chatService.remove(id);

		const socketMessage: SocketMessage<Chat_List_Item> = {
			action: 'delete',
			data: {
				id: id,
			},
		};
		this.socketService.chatlist_emit('all', socketMessage);
		return deleteResult;
	}
}
