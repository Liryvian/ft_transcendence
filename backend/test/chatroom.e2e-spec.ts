import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateChatroomDto } from '../src/chat/chatroom/dto/create-chatroom.dto';
import { ChatroomController } from '../src/chat/chatroom/chatroom.controller';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { AnimalModule } from '../src/test_example/animal.module';
import { ChatroomModule } from '../src/chat/chatroom/chatroom.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Chatroom } from '../src/chat/chatroom/entities/chatroom.entity';

describe('chatroom e2e', () => {
	let app: INestApplication;
	let chatroomController: ChatroomController;
	const testChatrooms: CreateChatroomDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const MockChatroom: CreateChatroomDto = {
		name: 'C',
		visibility: 'Indeed',
		password: 'C',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				ChatroomModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		chatroomController =
			moduleFixture.get<ChatroomController>(ChatroomController);

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
