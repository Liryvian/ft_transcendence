import { Test, TestingModule } from '@nestjs/testing';
import { InsertResult } from 'typeorm';

import { Chat } from '../chat/entities/chat.entity';
import { ChatController } from '../chat/chat.controller';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { User } from '../../users/user/entities/user.entity';
import { UserController } from '../../users/user/user.controller';
import { UserService } from '../../users/user/user.service';
import { AllTestingModule } from '../../shared/test.module';

describe('MessageController', () => {
	let messageController: MessageController;
	let chatController: ChatController;
	let messageService: MessageService;
	let testingModule: TestingModule;
	let userController: UserController;
	let userService: UserService;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const testMessages: CreateMessageDto[] = [
		{ sender_id: 1, chat_id: 1, content: 'hello' },
		{ sender_id: 2, chat_id: 2, content: 'world!' },
	];

	let seedUsers = [
		{ name: 'DefaultUsr', password: 'Password for default user', userId: -1 },
		{ name: 'secondUser', password: 'Second users password', userId: -1 },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		messageController = testingModule.get<MessageController>(MessageController);
		messageService = testingModule.get<MessageService>(MessageService);

		chatController = testingModule.get<ChatController>(ChatController);
		userController = testingModule.get<UserController>(UserController);
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

		for (const message in testMessages) {
			await messageController.create(testMessages[message]);
		}
	});

	afterAll(async () => {
		const repoOfMessages: Message[] = await messageController.findAll();
		for (let i = 0; i < repoOfMessages.length; i++) {
			await messageController.remove(repoOfMessages[i].id);
		}

		const repoOfChats: Chat[] = await chatController.findAll();
		for (let i = 0; i < repoOfChats.length; i++) {
			await chatController.remove(repoOfChats[i].id);
		}

		const repoOfUsers: User[] = await userController.findAll();
		for (let i = 0; i < repoOfUsers.length; i++) {
			await userService.remove(repoOfUsers[i].id);
		}
	});

	it('should be defined', () => {
		expect(messageController).toBeDefined();
		expect(messageService).toBeDefined();
	});

	it('Check if chat_id and other columns exists in messages', async () => {
		const allMessages: Message[] = await messageController.findAll();
		expect(allMessages).toHaveLength(2);
		for (let index = 0; index < allMessages.length; index++) {
			expect(allMessages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						chat_id: expect.objectContaining({
							id: testMessages[index].chat_id,
						}),
						sender_id: expect.objectContaining({
							id: testMessages[index].sender_id,
						}),
						created_at: expect.any(Date),
						updated_at: expect.any(Date),
						content: testMessages[index].content,
					}),
				]),
			);
		}
	});

	it('Get a specific message', async () => {
		const specificMessage = 1;
		const message: Message = await messageController.findOne(specificMessage);
		expect(message.id).toBe(specificMessage);
	});
});
