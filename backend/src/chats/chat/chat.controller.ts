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
	Req,
	HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatType, ChatVisibility } from './entities/chat.entity';
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
import {
	ChatUserPermission,
	permissionsEnum,
} from '../chat-user-permissions/entities/chat-user-permission.entity';
import { ChatUserPermissionService } from '../chat-user-permissions/chat-user-permission.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
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
						permission: permission as permissionsEnum,
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
					type: chat.type,
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
	async chatMessages(@Param('id') chatId: number, @Req() request: Request) {
		try {
			// verify that we have a valid and existing user from the request
			const userId: number = await this.authService.validUserId(request);
			// verify that we have a valid chat id from the parameter
			const chat: Chat = await this.chatService.findOne({
				where: { id: chatId },
			});

			// get users permssions from the chat
			const userPermissions: ChatUserPermission[] =
				await this.chatUserPermissionService.findAll({
					where: {
						user_id: userId,
						chat_id: chat.id,
					},
				});

			// reject if there are no permisisons at all for chat_id<->user_id
			// or if user has a BLOCKED permission
			if (
				userPermissions.length === 0 ||
				userPermissions.findIndex(
					(permission) => permission.permission === permissionsEnum.BLOCKED,
				) !== -1
			) {
				return [];
			}

			// there are 2 cases where you need explicit READ permissions to download
			// the message list:
			//
			// 1. if it's a DM
			// 2. if it's a private channel
			if (
				chat.type === 'dm' ||
				(chat.type === 'channel' && chat.visibility === 'private')
			) {
				if (
					userPermissions.findIndex(
						(permission) => permission.permission === permissionsEnum.READ,
					) === -1
				) {
					return [];
				}
			}
		} catch (e) {
			// catching:
			// - invalid JWT token
			// - invalid user id
			// - invalid chat id
			return [];
		}

		return this.messageService.findAll({
			where: { chat: { id: chatId } },
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

	@Post(':id/join')
	@HttpCode(200)
	async joinChat(@Param('id') chatId: number, @Req() request: Request) {
		try {
			// verify that we have a valid and existing user from the request
			const userId: number = await this.authService.validUserId(request);
			// verify that we have a valid chat id from the parameter
			const chat: Chat = await this.chatService.findOne({
				where: { id: chatId },
			});

			await this.chatUserPermissionService.save([
				{
					chat_id: chat.id,
					user_id: userId,
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat.id,
					user_id: userId,
					permission: permissionsEnum.POST,
				},
			]);

			// @TODO
			// emit socket message!
		} catch (e) {
			console.log(e);
			return false;
		}
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
