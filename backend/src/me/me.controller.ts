import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Chat, ChatUser } from '../chats/chat/entities/chat.entity';
import { ChatService } from '../chats/chat/chat.service';
import { UserService } from '../users/user/user.service';
import { UserRelationsQueryDto } from '../users/user/dto/user-relations-query.dto';
import { permissionsEnum } from '../chats/chat-user-permissions/entities/chat-user-permission.entity';
import { User } from '../users/user/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly chatService: ChatService,
	) {}

	@Get()
	async me(
		@Req() request: Request,
		@Query() userRelationsQuery?: UserRelationsQueryDto,
	) {
		const id = await this.authService.userId(request);
		try {
			const me: User = await this.userService.findOne({
				where: { id },
				relations: userRelationsQuery ?? {},
			});
			return me;
		} catch (e) {
			return {};
		}
	}

	@Get('achievements')
	async achievements(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'achievements';
	}

	@Get('users')
	async users_visible_to_me(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'users visible to me';
	}

	@Get('blocked')
	async blocked(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'list of users that I blocked';
	}

	@Get('friends')
	async friends(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'list of users that I friended';
	}

	// gets chats where "I" am not blocked

	@Get('chats')
	async chats(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		// if you add the relationship here it only returns relations where you are the user, not all users in the chat
		const chatIds: Chat[] = await this.chatService.findAll({
			select: { id: true },
			where: [
				{
					has_users: {
						user_id: id,
					},
				},
				{
					visibility: 'public',
				},
			],
		});

		const chats: Chat[] = (
			await this.chatService.findAll({
				where: chatIds.map((c: Chat) => ({
					id: c.id,
				})),
				relations: { has_users: { users: true } },
			})
		).filter(
			// removes chats where "I" am blocked
			(chat: Chat) =>
				chat.users.findIndex(
					(user: ChatUser) =>
						user.id === id &&
						user.permissions.findIndex((p) => p === permissionsEnum.BLOCKED) !==
							-1,
				) === -1,
		);

		return chats;
	}
}
