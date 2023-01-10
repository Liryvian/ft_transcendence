import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from '../src/chats/message/dto/create-message.dto';
import { MessageController } from '../src/chats/message/message.controller';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { AnimalModule } from '../src/test_example/animal.module';
import { MessageModule } from '../src/chats/message/message.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Message } from '../src/chats/message/entities/message.entity';
import { CreateChatDto } from '../src/chats/chat/dto/create-chat.dto';
import { ChatController } from '../src/chats/chat/chat.controller';
import { MessageService } from '../src/chats/message/message.service';
import { ChatService } from '../src/chats/chat/chat.service';
import { Chatroom } from '../src/chats/chat/entities/chat.entity';

describe('message e2e', () => {
	let chatroomController: ChatController;
	let messageService: MessageService;
	let chatroomService: ChatService;
	let testingModule: TestingModule;
	let app: INestApplication;
	let messageController: MessageController;
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

		app = testingModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		messageController = testingModule.get<MessageController>(MessageController);
		chatroomController =
			testingModule.get<ChatController>(ChatController);
		messageService = testingModule.get<MessageService>(MessageService);
		chatroomService = testingModule.get<ChatService>(ChatService);

		// seed db with animals for each testcase
		for (const chatroom in testChatrooms) {
			await chatroomController.create(testChatrooms[chatroom]);
		}

		for (const message in testMessages) {
			await messageController.create(testMessages[message]);
		}
	});

	afterAll(async () => {
		const allGames: Message[] = await messageController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await messageController.remove(allGames[index].id);
		}
		await app.close();
	});

	describe('/messages (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/messages')
				.expect(HttpStatus.OK);
		});
	});
});
