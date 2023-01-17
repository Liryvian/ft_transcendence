import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { AnimalModule } from '../../test_example/animal.module';
import { ChatModule } from './chat.module';
import { MessageModule } from '../message/message.module';
import { RoleModule } from '../role/role.module';
import { GameModule } from '../../pong/game/game.module';
import { UserChatModule } from '../user-chat/user-chat.module';
import { GameInvitesModule } from '../../pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../../pong/matchmaking-request/matchmaking-request.module';

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
				TypeOrmModule.forFeature([Chat]),
				AuthModule,
				SharedModule,
				AnimalModule,
				ChatModule,
				MessageModule,
				UserModule,
				RoleModule,
				GameModule,
				UserChatModule,
				GameInvitesModule,
				MatchmakingRequestModule,
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
