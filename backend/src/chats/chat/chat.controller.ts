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
	ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { DeleteResult } from 'typeorm';
import { ChatRelationsBodyDto } from './dto/chat-relations-body.dto';
import { ChatRelationsQueryDto } from './dto/chat-relations-query.dto';
import { MessageService } from '../message/message.service';
import { SocketService } from '../../socket/socket.service';
import { Chat_List_Item, SocketMessage } from '../../socket/socket.types';
import { UserInChat } from '../../users/user/entities/user.entity';
import {
	ChatUserPermission,
	permissionsEnum,
} from '../chat-user-permissions/entities/chat-user-permission.entity';
import { ChatUserPermissionService } from '../chat-user-permissions/chat-user-permission.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { UserRelationshipService } from '../../users/user-relationship/user-relationship.service';
import { Message } from '../message/entities/message.entity';

@UseGuards(AuthGuard())
@Controller('chats')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
		private readonly socketService: SocketService,
		private readonly chatUserPermissionService: ChatUserPermissionService,
		private readonly userRelationshipService: UserRelationshipService,
	) {}

	private readonly defaultRelationships = { has_users: true };

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

		// make sure dm names are unique
		if (createChatDto.type === 'dm') {
			// check if dm between the two users already exists
			try {
				const hasDM = this.chatService.findOne({
					where: {
						has_users: [
							{ user_id: createChatDto.users[0].id },
							{ user_id: createChatDto.users[1].id },
						],
						type: 'dm',
					},
				});
				return hasDM;
			} catch (e) {}
			createChatDto.name += '--' + crypto.pseudoRandomBytes(4).toString('hex');
		}

		let chat: Chat;
		try {
			chat = await this.chatService.save(createChatDto);
		} catch (e) {
			console.log(e);
			return false;
		}

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
					users: chat.users ?? [],
					hasPassword: chat.hasPassword,
				},
			};
			if (
				chat.type === 'dm' ||
				(chat.type === 'channel' && chat.visibility === 'private')
			) {
				this.socketService.chatlist_emit(
					chat.users.map((u) => u.id),
					socketMessage,
				);
			} else {
				this.socketService.chatlist_emit('all', socketMessage);
			}
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
			order: {
				created_at: 'asc',
			},
		});
	}

	@Get(':id/messages')
	async chatMessages(@Param('id') chatId: number, @Req() request: Request) {
		try {
			// verify that we have a valid and existing user from the request
			const myId: number = await this.authService.validUserId(request);
			// verify that we have a valid chat id from the parameter
			const chat: Chat = await this.chatService.findOne({
				where: { id: chatId },
			});

			// get users permssions from the chat
			const userPermissions: ChatUserPermission[] =
				await this.chatUserPermissionService.findAll({
					where: {
						user_id: myId,
						chat_id: chat.id,
					},
				});

			// reject if there are no permisisons at all for chat_id<->user_id
			// or if user has a BLOCKED permission
			if (
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

			// get blocked users
			const blocked = await this.userRelationshipService.findAll({
				where: [
					{
						type: 'blocked',
						source: {
							id: myId,
						},
					},
					{
						type: 'blocked',
						target: {
							id: myId,
						},
					},
				],
				relations: { source: true, target: true },
			});
			const blockedUserIds = blocked.map((relation) => {
				if (relation.source.id === myId) {
					return relation.target.id;
				}
				return relation.source.id;
			});

			return (
				await this.messageService.findAll({
					where: { chat: { id: chatId } },
				})
			).filter((message: Message) => {
				return blockedUserIds.indexOf(message.user_id) === -1;
			});
		} catch (e) {
			// catching:
			// - invalid JWT token
			// - invalid user id
			// - invalid chat id
			return [];
		}
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
			order: { created_at: 'asc' },
		});
	}

	async checkAuthenticatedUserCanManageUsers(chatId: number, request: Request) {
		// verify that we have a valid and existing user from the request
		const userId: number = await this.authService.validUserId(request);
		// verify that we have a valid chat id from the parameter
		const chat: Chat = await this.chatService.findOne({
			where: { id: chatId },
		});

		// get authenticated users permssions from the chat
		const userPermissions: ChatUserPermission[] =
			await this.chatUserPermissionService.findAll({
				where: [
					{
						user_id: userId,
						chat_id: chat.id,
						permission: permissionsEnum.OWNER,
					},
					{
						user_id: userId,
						chat_id: chat.id,
						permission: permissionsEnum.MANAGE_USERS,
					},
				],
			});
		if (userPermissions.length === 0) {
			throw new ForbiddenException(
				'No permissions for authenticated user to do kick/ban/mute',
			);
		}
		return chat;
	}

	findUserWithPermisisonsInChat(
		permissions: permissionsEnum[],
		chatId: number,
		userId: number,
	) {
		return this.chatUserPermissionService.findAll({
			where: permissions.map((p) => ({
				user_id: userId,
				chat_id: chatId,
				permission: p,
			})),
		});
	}

	@Patch(':chatId/kick/:userId')
	async kickUser(
		@Param('chatId') chatId: number,
		@Param('userId') userId: number,
		@Req() request: Request,
	) {
		try {
			const chat = await this.checkAuthenticatedUserCanManageUsers(
				chatId,
				request,
			);

			// cannot kick owner

			// search for permissions in [MANAGE_USERS, EDIT_SETTINGS, READ, POST]
			// and remove them
			const currentPermissions = await this.findUserWithPermisisonsInChat(
				[
					permissionsEnum.MANAGE_USERS,
					permissionsEnum.EDIT_SETTINGS,
					permissionsEnum.READ,
					permissionsEnum.POST,
					permissionsEnum.OWNER,
				],
				chat.id,
				userId,
			);

			if (
				currentPermissions.find(
					(cup) => cup.permission === permissionsEnum.OWNER,
				)
			) {
				throw new ForbiddenException('Cannot kick owner');
			}

			await this.chatUserPermissionService.remove(
				currentPermissions.map((cup) => p.id),
			);

			// emit socket message
			return true;
		} catch (e) {
			// not able to do action for whatever reason
			return false;
		}
	}

	@Patch(':chatId/ban/:userId')
	async banUser(
		@Param('chatId') chatId: number,
		@Param('userId') userId: number,
		@Req() request: Request,
	) {
		try {
			const chat = await this.checkAuthenticatedUserCanManageUsers(
				chatId,
				request,
			);

			const currentPermissions = await this.findUserWithPermisisonsInChat(
				[
					permissionsEnum.MANAGE_USERS,
					permissionsEnum.EDIT_SETTINGS,
					permissionsEnum.READ,
					permissionsEnum.POST,
					permissionsEnum.BLOCKED,
					permissionsEnum.OWNER,
				],
				chat.id,
				userId,
			);

			if (
				currentPermissions.find(
					(cup) => cup.permission === permissionsEnum.OWNER,
				)
			) {
				throw new ForbiddenException('Cannot ban owner');
			}

			await this.chatUserPermissionService.remove(
				currentPermissions.map((p) => p.id),
			);
			// set blocked
			await this.chatUserPermissionService.save({
				user_id: userId,
				chat_id: chat.id,
				permission: permissionsEnum.BLOCKED,
			});

			// emit socket message
			return true;
		} catch (e) {
			// not able to do action for whatever reason
			return false;
		}
	}

	@Patch(':chatId/mute/:userId')
	async muteUser(
		@Param('chatId') chatId: number,
		@Param('userId') userId: number,
		@Req() request: Request,
	) {
		try {
			const chat = await this.checkAuthenticatedUserCanManageUsers(
				chatId,
				request,
			);

			const currentPermissions = await this.findUserWithPermisisonsInChat(
				[permissionsEnum.POST, permissionsEnum.OWNER],
				chat.id,
				userId,
			);
			if (
				currentPermissions.find(
					(cup) => cup.permission === permissionsEnum.OWNER,
				)
			) {
				throw new ForbiddenException('Cannot mute owner');
			}
			await this.chatUserPermissionService.remove(
				currentPermissions.map((p) => p.id),
			);

			// emit socket message
			return true;
		} catch (e) {
			// not able to do action for whatever reason
			return false;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChatDto: UpdateChatDto) {
		if (updateChatDto.hasOwnProperty('password')) {
			const current_Chat: Chat = await this.chatService.findOne({
				where: { id },
			});
			// check permissions
			if (
				!(await bcrypt.compare(updateChatDto.password, current_Chat.password))
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

	@Post(':id/verify_password')
	async verifyChatPassword(
		@Param('id') chatId: number,
		@Body() chatPassword: { password: string },
	) {
		if (
			!chatPassword.hasOwnProperty('password') ||
			chatPassword.password.trim().length === 0
		) {
			return false;
		}
		try {
			const chatInfo = await this.chatService.findOne({
				where: { id: chatId },
			});
			if (chatInfo.hasPassword === false) {
				// wtf? it doesn't have password.. why are you checking?
				return true;
			}
			return bcrypt.compare(chatPassword.password, chatInfo.password);
		} catch (e) {}
		return false;
	}

	@Post(':id/join')
	async joinChat(@Param('id') chatId: number, @Req() request: Request) {
		try {
			// verify that we have a valid and existing user from the request
			const userId: number = await this.authService.validUserId(request);
			// verify that we have a valid chat id from the parameter
			const chat: Chat = await this.chatService.findOne({
				where: { id: chatId },
			});

			// get existing permisisons for user
			const existingPermissions = await this.chatUserPermissionService.findAll({
				where: { chat_id: chat.id, user_id: userId },
			});

			const permissionsToAdd: Partial<ChatUserPermission>[] = [];

			if (
				existingPermissions.find(
					(perm) => perm.permission === permissionsEnum.BLOCKED,
				)
			) {
				throw new ForbiddenException('User can not join chat');
			}

			// if no read permissions, add them
			if (
				existingPermissions.find(
					(perm) => perm.permission === permissionsEnum.READ,
				) === undefined
			) {
				permissionsToAdd.push({
					chat_id: chat.id,
					user_id: userId,
					permission: permissionsEnum.READ,
				});
			}

			// if no post permisisons, add them
			if (
				existingPermissions.find(
					(perm) => perm.permission === permissionsEnum.POST,
				) === undefined
			) {
				permissionsToAdd.push({
					chat_id: chat.id,
					user_id: userId,
					permission: permissionsEnum.POST,
				});
			}

			// if user had left before, remove left state
			const LEFT_permission = existingPermissions.find(
				(perm) => perm.permission === permissionsEnum.LEFT,
			);
			if (LEFT_permission !== undefined) {
				await this.chatUserPermissionService.remove(LEFT_permission.id);
			}

			if (permissionsToAdd.length === 0) {
				// do nothing?
				return true;
			}

			await this.chatUserPermissionService.save(permissionsToAdd);

			if (this.socketService.chatServer !== null) {
				const updatedChat = await this.chatService.findOne({
					where: { id: chat.id },
					relations: { has_users: { users: true } },
				});

				const socketMessage: SocketMessage<Chat_List_Item> = {
					action: 'update',
					data: {
						id: chat.id,
						users: updatedChat.users,
					},
				};

				this.socketService.chatlist_emit(
					updatedChat.users.map((user) => user.id),
					socketMessage,
				);
			}
		} catch (e) {
			console.log(e);
			return false;
		}
		return {};
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
