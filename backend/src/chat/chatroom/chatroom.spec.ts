import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Chatroom } from './entities/chatroom.entity';
import { AnimalEntity } from '../../test_example/entities/animals.entity';
import { getConfigParseResult } from 'ts-loader/dist/config';
import { CreateChatroomDto } from './dto/create-chatroom.dto';

describe('ChatroomController', () => {
	let controller: ChatroomController;
	let service: ChatroomService;
	let testingModule: TestingModule;

	const testChatrooms: CreateChatroomDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Chatroom]),
			],
			controllers: [ChatroomController],
			providers: [ChatroomService],
		}).compile();

		controller = testingModule.get<ChatroomController>(ChatroomController);
		service = testingModule.get<ChatroomService>(ChatroomService);

		for (const chatroom in testChatrooms) {
			await controller.create(testChatrooms[chatroom]);
		}
	});

	afterAll(async () => {
		const repoOfChatrooms: Chatroom[] = await controller.findAll();
		for (let i = 0; i < repoOfChatrooms.length; i++) {
			await controller.remove(i + 1);
		}
	});

	it('Get all Chatrooms', async () => {
		const allChatrooms: Chatroom[] = await controller.findAll();
		expect(allChatrooms).toHaveLength(2);
		for (let index = 0; index < allChatrooms.length; index++) {
			expect(allChatrooms).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: testChatrooms[index],
						visibility: testChatrooms[index],
						password: testChatrooms[index],
					}),
				]),
			);
		}
	});

	it('Get a specific chatroom', async () => {
		const specificChatroom = 2;
		const chatroom: Chatroom = await controller.findOne(specificChatroom);
		expect(chatroom.id).toBe(specificChatroom);
	});
});

// cosnt mockCR: createChatDTo = [{name: "hallo", visibility:  "Private", password: "1234"}, {data, data, data}, {}]
