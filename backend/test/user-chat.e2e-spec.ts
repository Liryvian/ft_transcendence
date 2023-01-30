import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

import * as request from 'supertest';
import { CreateChatDto } from '../src/chats/chat/dto/create-chat.dto';
import { ChatController } from '../src/chats/chat/chat.controller';
import { UserChat } from '../src/chats/user-chat/entities/user-chat.entity';
import { UserController } from '../src/users/user/user.controller';
import { UserChatService } from '../src/chats/user-chat/user-chat.service';
import { UserChatController } from '../src/chats/user-chat/user-chat.controller';
import { AllTestingModule } from '../src/shared/test.module';

describe('userChat e2e', () => {
	let chatController: ChatController;
	let userController: UserController;
	let userChatService: UserChatService;
	let testingModule: TestingModule;
	let app: INestApplication;
	let userChatController: UserChatController;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];
	const chatIds = [];

	const testUsers = [
		{
			name: 'u1',
			password: 'p1',
			password_confirm: 'p1',
		},
		{
			name: 'u2',
			password: 'p2',
			password_confirm: 'p2',
		},
		{
			name: 'u3',
			password: 'p3',
			password_confirm: 'p3',
		},
	];
	let userIds = [];
	// let messageIds = [];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = testingModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		userChatController =
			testingModule.get<UserChatController>(UserChatController);
		chatController = testingModule.get<ChatController>(ChatController);
		userController = testingModule.get<UserController>(UserController);
		userChatService = testingModule.get<UserChatService>(UserChatService);
		// seed db with animals for each testcase

		for (const chat in testChats) {
			await chatController
				.create(testChats[chat])
				.then((chat) => chatIds.push(chat.identifiers[0].id));
		}
		for (const user in testUsers) {
			await userController
				.create(testUsers[user])
				.then((user) => userIds.push(user.identifiers[0].id));
		}

		// !! note this needs an update
		// const testUserChats: CreateUserChatDto[] = [
		// 	{ user_id: userIds[0], chat_id: chatIds[0] },
		// 	{ user_id: userIds[1], chat_id: chatIds[1] },
		// ];
		//
		// for (const userChat in testUserChats) {
		// 	await userChatController.create(testUserChats[userChat]);
		// }
		// console.log(await userChatController.findAll());
	});

	afterAll(async () => {
		const allUserChats: UserChat[] = await userChatController.findAll();

		for (let index = 0; index < allUserChats.length; index++) {
			await userChatController.remove(allUserChats[index].user_id);
			await userChatController.remove(allUserChats[index].chat_id);
		}
		await app.close();
	});

	describe('/user-chats (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/user-chats')
				.expect(HttpStatus.OK);
		});
	});
});
