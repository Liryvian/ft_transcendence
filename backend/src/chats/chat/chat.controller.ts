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
	UseGuards,
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
import { ChatUserPermissionService } from '../chat-user-permissions/chat-user-permission.service';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly messageService: MessageService,
		private readonly socketService: SocketService,
		private readonly chatUserPermissionService: ChatUserPermissionService,
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

		// post can contain minimal data:
		// users: [{"id":7,"permissions":["read","post"]}]
		// Unpack userInChat from Dto, to save with relations, after creating chat
		const users: UserInChat[] = [];
		if (createChatDto.hasOwnProperty('users')) {
			createChatDto.users.forEach((user) => users.push(user));
			delete createChatDto.users;
		}
		let chat: Chat = await this.chatService.save(createChatDto);

		// Now add userInChat after unpacking it's permissions array
		if (users.length) {
			const relations: Partial<ChatUserPermission>[] = [];
			users.forEach((user: UserInChat) => {
				user.permissions.forEach((permission: string) => {
					relations.push({
						user_id: user.id,
						chat_id: chat.id,
						permission: permission,
					});
				});
			});
			await this.chatUserPermissionService.save(relations);
		}

		// If socket connection exists, emit message with up-to-date chat
		if (this.socketService.chatServer !== null) {
			chat = await this.chatService.findOne({
				where: { id: chat.id },
				relations: { has_users: { users: true } },
			});
			const socketMessage: SocketMessage<Chat_List_Item> = {
				action: 'new',
				data: {
					id: chat.id,
					name: chat.name,
					type: chat.type as Chat_Type,
					users:
						chat.users?.map((user) => ({
							id: user.id,
							name: user.name,
							avatar: user.avatar,
						})) ?? [],
				},
			};
			this.socketService.chatlist_emit('all', socketMessage);
		}
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
		// @TODO
		// get user from JWT token and verify if user has read permissions for this chatId
		return this.messageService.findAll({
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
		const current_Chat: Chat = await this.chatService.findOne({
			where: { id },
		});

		if (this.socketService.chatServer !== null) {
			const socketMessage: SocketMessage<Chat_List_Item> = {
				action: 'update',
				data: {
					id: current_Chat.id,
					name: current_Chat.name,
				},
			};
			this.socketService.chatlist_emit('all', socketMessage);
		}
		return chat;
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		const deleteResult: DeleteResult = await this.chatService.remove(id);

		if (this.socketService.chatServer !== null) {
			const socketMessage: SocketMessage<Chat_List_Item> = {
				action: 'delete',
				data: {
					id: id,
				},
			};
			this.socketService.chatlist_emit('all', socketMessage);
		}
		return deleteResult;
	}
}
