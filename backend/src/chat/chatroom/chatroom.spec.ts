import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Chatroom } from './entities/chatroom.entity';
import { AnimalEntity } from '../../test_example/entities/animals.entity';
import {getConfigParseResult} from "ts-loader/dist/config";

describe('ChatroomController', () => {
	let controller: ChatroomController;
	let service: ChatroomService;
	let testingModule: TestingModule;

	const testChatrooms = [
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

	it('Get all Chatrooms', () => {
        const allChatrooms: Chatroom[] = await controller.findAll();
		expect(allChatrooms).toBeDefined();
        for (let index = 0; index < allChatrooms.length; index++) {
            expect(allChatrooms[index].id).toBe(index + 1) // starts indexing in table from 1 not 0
            expect(allChatrooms[index].name).toBe(testChatrooms[index])
        }
	});
});

// cosnt mockCR: createChatDTo = [{name: "hallo", visibility:  "Private", password: "1234"}, {data, data, data}, {}]
