import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Chat } from '../chats/chat/entities/chat.entity';
import { ChatService } from '../chats/chat/chat.service';
import { UserService } from '../users/user/user.service';
import { UserRelationsQueryDto } from '../users/user/dto/user-relations-query.dto';

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
	) {
		const id = await this.authService.userId(request);

		return this.userService.findAll({
			select: {
				id: true,
				name: true,
				is_intra: true,
				intra_login: true,
				avatar: true,
			},
			where: { id },
			relations: userRelationsQuery ?? {},
		});
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
		const chatIds: Chat[] = await this.chatService.findAll({
			select: { id: true },
			where: { has_users: { user_id: id } },
			// add WHERE clause to filter blocked..
		});

		const chats: Chat[] = await this.chatService.findAll({
			where: chatIds,
			relations: { has_users: { users: true } },
		});

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
