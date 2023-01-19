import { Test, TestingModule } from '@nestjs/testing';

import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AllTestingModule } from '../../shared/test.module';

describe('ChatController', () => {
	let controller: ChatController;
	let service: ChatService;
	let testingModule: TestingModule;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		controller = testingModule.get<ChatController>(ChatController);
		service = testingModule.get<ChatService>(ChatService);

		for (const chat in testChats) {
			await controller.create(testChats[chat]);
		}
	});

	afterAll(async () => {
		const repoOfChats: Chat[] = await controller.findAll();
		for (let i = 0; i < repoOfChats.length; i++) {
			await controller.remove(i + 1);
		}
	});

	it('Get all Chats', async () => {
		const allChats: Chat[] = await controller.findAll();
		expect(allChats).toHaveLength(2);
		for (let index = 0; index < allChats.length; index++) {
			expect(allChats).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: testChats[index].name,
						visibility: testChats[index].visibility,
						password: testChats[index].password,
					}),
				]),
			);
		}
	});

	it('Get a specific chat', async () => {
		const specificChat = 2;
		const chat: Chat = await controller.findOne(specificChat);
		expect(chat.id).toBe(specificChat);
	});
});

// cosnt mockCR: createChatDTo = [{name: "hallo", visibility:  "Private", password: "1234"}, {data, data, data}, {}]
