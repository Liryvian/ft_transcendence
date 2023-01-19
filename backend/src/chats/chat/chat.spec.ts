import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { SharedModule } from '../../shared/shared.module';

import { AuthModule } from '../../auth/auth.module';
import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Game } from '../../pong/game/entities/game.entity';
import { GameInvite } from '../../pong/game_invite/entities/game-invite.entity';
import { MatchmakingRequest } from '../../pong/matchmaking-request/entities/matchmaking-request.entity';
import { Message } from '../message/entities/message.entity';
import { Role } from '../role/entities/role.entity';
import { User } from '../../users/user/entities/user.entity';
import { UserChat } from '../user-chat/entities/user-chat.entity';

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
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([
					User,
					MatchmakingRequest,
					Game,
					GameInvite,
					Chat,
					Message,
					Role,
					UserChat,
				]),
				AuthModule,
				SharedModule,
			],
			controllers: [ChatController],
			providers: [ChatService],
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
