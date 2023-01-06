import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from '../src/chat/message/dto/create-message.dto';
import { MessageController } from '../src/chat/message/message.controller';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { AnimalModule } from '../src/test_example/animal.module';
import { MessageModule } from '../src/chat/message/message.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Message } from '../src/chat/message/entities/message.entity';
import { CreateChatroomDto } from '../src/chat/chatroom/dto/create-chatroom.dto';
import { ChatroomController } from '../src/chat/chatroom/chatroom.controller';
import { MessageService } from '../src/chat/message/message.service';
import { ChatroomService } from '../src/chat/chatroom/chatroom.service';
import { Chatroom } from '../src/chat/chatroom/entities/chatroom.entity';

describe('message e2e', () => {
	let chatroomController: ChatroomController;
	let messageService: MessageService;
	let chatroomService: ChatroomService;
	let testingModule: TestingModule;
	let app: INestApplication;
	let messageController: MessageController;
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

		app = testingModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		messageController = testingModule.get<MessageController>(MessageController);
		chatroomController =
			testingModule.get<ChatroomController>(ChatroomController);
		messageService = testingModule.get<MessageService>(MessageService);
		chatroomService = testingModule.get<ChatroomService>(ChatroomService);

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
