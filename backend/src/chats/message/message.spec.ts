import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ChatService } from '../chat/chat.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Chatroom } from '../chat/entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatController } from '../chat/chat.controller';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageController', () => {
	let messageController: MessageController;
	let chatroomController: ChatController;
	let messageService: MessageService;
	let chatroomService: ChatService;
	let testingModule: TestingModule;

	const testChatrooms: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const testMessages: CreateMessageDto[] = [
		{ chat_id: 1, content: 'hello' },
		{ chat_id: 1, content: 'world!' },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Message, Chatroom]),
			],
			controllers: [MessageController, ChatController],
			providers: [MessageService, ChatService],
		}).compile();

		messageController = testingModule.get<MessageController>(MessageController);
		chatroomController =
			testingModule.get<ChatController>(ChatController);
		messageService = testingModule.get<MessageService>(MessageService);
		chatroomService = testingModule.get<ChatService>(ChatService);

		// create one or two users that will exist till the "end" (once ready)

		for (const chatroom in testChatrooms) {
			await chatroomController.create(testChatrooms[chatroom]);
		}

		for (const message in testMessages) {
			await messageController.create(testMessages[message]);
		}
	});

	it('should be defined', () => {
		expect(messageController).toBeDefined();
		expect(messageService).toBeDefined();
	});

	it('Check if chat_id and other columns exists in messages', async () => {
		const allMessages: Message[] = await messageController.findAll();
		expect(allMessages).toHaveLength(2);
		console.log(allMessages);
		console.table(allMessages);
		for (let index = 0; index < allMessages.length; index++) {
			expect(allMessages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						chat_id: expect.objectContaining({
							id: testMessages[index].chat_id,
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
