import { Test, TestingModule } from '@nestjs/testing';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';
import { UserController } from '../../users/user/user.controller';
import { UserService } from '../../users/user/user.service';
import { ChatController } from '../chat/chat.controller';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Message } from '../message/entities/message.entity';
import { Chat } from '../chat/entities/chat.entity';
import { UserChat } from './entities/user-chat.entity';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { AnimalModule } from '../../test_example/animal.module';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { RoleModule } from '../role/role.module';
import { GameModule } from '../../pong/game/game.module';
import { UserChatModule } from './user-chat.module';
import { GameInvitesModule } from '../../pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../../pong/matchmaking-request/matchmaking-request.module';
import { InsertResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import any = jasmine.any;
import {User} from "../../users/user/entities/user.entity";

describe('UserChatController', () => {
	let userChatController: UserChatController;
	let userChatService: UserChatService;
	let userController: UserController;
	let userService: UserService;
	let chatController: ChatController;
	let chatService: ChatService;
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
				TypeOrmModule.forFeature([Message, Chat, UserChat]),
				UserModule,
				AuthModule,
				SharedModule,
				AnimalModule,
				ChatModule,
				MessageModule,
				UserModule,
				RoleModule,
				GameModule,
				UserChatModule,
				GameInvitesModule,
				MatchmakingRequestModule,
			],
			controllers: [UserChatController, ChatController, UserController],
			providers: [UserChatService, ChatService, UserChatService],
		}).compile();

		userChatController =
			testingModule.get<UserChatController>(UserChatController);
		userChatService = testingModule.get<UserChatService>(UserChatService);
		userController = testingModule.get<UserController>(UserController);
		chatController = testingModule.get<ChatController>(ChatController);
		userService = testingModule.get<UserService>(UserService);
		chatService = testingModule.get<ChatService>(ChatService);

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
		console.log(allUserChats);
		console.table(allUserChats);
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

	//check if chat_id en user_id update
});
