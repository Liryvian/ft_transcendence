import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ChatroomService } from '../chatroom/chatroom.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Chatroom } from '../chatroom/entities/chatroom.entity';
import { Message } from './entities/message.entity';
import { ChatroomController } from '../chatroom/chatroom.controller';
import { CreateChatroomDto } from '../chatroom/dto/create-chatroom.dto';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageController', () => {
	let messageController: MessageController;
	let chatroomController: ChatroomController;
	let messageService: MessageService;
	let chatroomService: ChatroomService;
	let testingModule: TestingModule;

	const testChatrooms: CreateChatroomDto[] = [
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
			controllers: [MessageController, ChatroomController],
			providers: [MessageService, ChatroomService],
		}).compile();

		messageController = testingModule.get<MessageController>(MessageController);
		chatroomController =
			testingModule.get<ChatroomController>(ChatroomController);
		messageService = testingModule.get<MessageService>(MessageService);
		chatroomService = testingModule.get<ChatroomService>(ChatroomService);

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
