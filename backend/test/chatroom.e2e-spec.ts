import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateChatDto } from '../src/chats/chat/dto/create-chat.dto';
import { ChatController } from '../src/chats/chat/chat.controller';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { AnimalModule } from '../src/test_example/animal.module';
import { ChatModule } from '../src/chats/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Chatroom } from '../src/chats/chat/entities/chat.entity';

describe('chat e2e', () => {
	let app: INestApplication;
	let chatroomController: ChatController;
	const testChatrooms: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const MockChatroom: CreateChatDto = {
		name: 'C',
		visibility: 'Indeed',
		password: 'C',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				ChatModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		chatroomController =
			moduleFixture.get<ChatController>(ChatController);

		// seed db with animals for each testcase
		for (const chatroom in testChatrooms) {
			await chatroomController.create(testChatrooms[chatroom]);
		}
	});

	afterAll(async () => {
		const chatrooms: Chatroom[] = await chatroomController.findAll();

		for (let index = 0; index < chatrooms.length; index++) {
			await chatroomController.remove(chatrooms[index].id);
		}
		await app.close();
	});

	describe('/chatrooms (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/chatrooms')
				.expect(HttpStatus.OK);
		});
	});
});
