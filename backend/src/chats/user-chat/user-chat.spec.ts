import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { InsertResult } from 'typeorm';

import { AuthModule } from '../../auth/auth.module';
import { Chat } from '../chat/entities/chat.entity';
import { ChatController } from '../chat/chat.controller';
import { ChatModule } from '../chat/chat.module';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { Game } from '../../pong/game/entities/game.entity';
import { GameInvite } from '../../pong/game_invite/entities/game-invite.entity';
import { MatchmakingRequest } from '../../pong/matchmaking-request/entities/matchmaking-request.entity';
import { Message } from '../message/entities/message.entity';
import { Role } from '../role/entities/role.entity';
import { SharedModule } from '../../shared/shared.module';
import { User } from '../../users/user/entities/user.entity';
import { UserChat } from './entities/user-chat.entity';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';
import { UserController } from '../../users/user/user.controller';
import { UserModule } from '../../users/user/user.module';
import { UserService } from '../../users/user/user.service';

describe('UserChatController', () => {
	let userChatController: UserChatController;
	let userChatService: UserChatService;
	let userService: UserService;
	let chatController: ChatController;
	let testingModule: TestingModule;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	let seedUsers = [
		{ name: 'DefaultUsr', password: 'Password for default user', userId: -1 },
		{ name: 'secondUser', password: 'Second users password', userId: -1 },
	];

	const testUserChats = [
		{ user_id: -1, chat_id: -1 },
		{ user_id: -1, chat_id: -1 },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([
					User,
					MatchmakingRequest,
					Game,
					GameInvite,
					Chat,
					Message,
					Role,
					UserChat,
				]),
				AuthModule,
				SharedModule,
				ChatModule,
				UserModule,
			],
			controllers: [UserChatController],
			providers: [UserChatService],
		}).compile();

		userChatController =
			testingModule.get<UserChatController>(UserChatController);
		userChatService = testingModule.get<UserChatService>(UserChatService);

		chatController = testingModule.get<ChatController>(ChatController);
		userService = testingModule.get<UserService>(UserService);

		for (const chat in testChats) {
			await chatController.create(testChats[chat]);
		}

		for (let index = 0; index < seedUsers.length; index++) {
			const data: CreateUserDto = {
				name: seedUsers[index].name,
				password: seedUsers[index].password,
				is_intra: false,
			};
			const newUserResult: InsertResult = await userService.create(data);
			seedUsers[index].userId = newUserResult.identifiers[0].id;
		}

		const chats = await chatController.findAll();
		testUserChats[0].user_id = seedUsers[0].userId;
		testUserChats[0].chat_id = chats[0].id;

		testUserChats[1].user_id = seedUsers[1].userId;
		testUserChats[1].chat_id = chats[1].id;

		for (const userChat in testUserChats) {
			await userChatController.create(testUserChats[userChat]);
		}
	});

	it('should be defined', () => {
		expect(userChatController).toBeDefined();
		expect(userChatService).toBeDefined();
	});

	// !! these need to be finished
	it('Check chat_id and user_id exist', async () => {
		const allUserChats: UserChat[] = await userChatController.findAll();
		expect(allUserChats).toHaveLength(2);
		for (let index = 0; index < allUserChats.length; index++) {
			expect(allUserChats).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						user_id: testUserChats[index].user_id,
						chat_id: testUserChats[index].chat_id,
						chats: expect.any(Chat),
						users: expect.any(User),
					}),
				]),
			);
		}
	});

	it('Check duplicate user, error expected', async () => {
		await expect(userChatController.create(testUserChats[0])).rejects.toThrow(
			'user can only be in a chat once',
		);
	});

	// await expect(
	// 	service.create({
	// 		name: seedUsers[0].name,
	// 		password: seedUsers[0].password + 'a',
	// 		is_intra: false,
	// 	}),
	// ).rejects.toThrow('UNIQUE constraint failed');
});
