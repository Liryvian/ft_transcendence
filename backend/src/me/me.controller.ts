import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Chat, ChatUser } from '../chats/chat/entities/chat.entity';
import { ChatService } from '../chats/chat/chat.service';
import { UserService } from '../users/user/user.service';
import { UserRelationsQueryDto } from '../users/user/dto/user-relations-query.dto';
import { UserRelationsBodyDto } from '../users/user/dto/user-relations-body.dto';
import { User } from '../users/user/entities/user.entity';

@Controller('me')
export class MeController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly chatService: ChatService,
	) {}

	@UseGuards(AuthGuard)
	@Get()
	async me(
		@Req() request: Request,
		@Query() userRelationsQuery?: UserRelationsQueryDto,
		@Body() userRelationsBody?: UserRelationsBodyDto,
	) {
		const id = await this.authService.userId(request);
		const userRelations = Object.keys(userRelationsBody ?? {}).length
			? userRelationsBody
			: Object.keys(userRelationsQuery ?? {}).length
			? userRelationsQuery
			: {};

		const user: User[] = await this.userService.findAll({
			select: {
				id: true,
				name: true,
				is_intra: true,
				intra_login: true,
				avatar: true,
				// relationships: true,
			},
			where: { id },
			relations: userRelations,
		});
		console.log(user[0].relationships);
		return user[0];
	}

	@UseGuards(AuthGuard)
	@Get('achievements')
	async achievements(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'achievements';
	}

	@UseGuards(AuthGuard)
	@Get('users')
	async users_visible_to_me(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'users visible to me';
	}

	@UseGuards(AuthGuard)
	@Get('blocked')
	async blocked(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'list of users that I blocked';
	}

	@UseGuards(AuthGuard)
	@Get('friends')
	async friends(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		return 'list of users that I friended';
	}

	@UseGuards(AuthGuard)
	@Get('chats')
	async chats(@Req() request: Request) {
		const id: number = await this.authService.userId(request);

		// if you add the relationship here it only returns relations where you are the user, not all users in the chat
		const chatIds: Chat[] = await this.chatService.findAll({
			select: { id: true },
			where: {
				has_users: {
					user_id: id,
				},
			},
		});

		const chats: Chat[] = (
			await this.chatService.findAll({
				where: chatIds,
				relations: { has_users: { users: true } },
			})
		).filter(
			// removes chats where "I" am blocked
			(chat: Chat) =>
				chat.users.findIndex(
					(user: ChatUser) =>
						user.id == id &&
						user.permissions.findIndex((p) => p.name === 'blocked') !== -1,
				) === -1,
		);

		return chats.map((chat) => {
			const obj = {
				...chat,
				users: chat.users,
			};
			delete obj.has_users;
			return obj;
		});
	}
}
