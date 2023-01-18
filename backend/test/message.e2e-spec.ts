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
import { Chat } from '../src/chats/chat/entities/chat.entity';
import { ChatModule } from '../src/chats/chat/chat.module';
import { UserModule } from '../src/users/user/user.module';
import { RoleModule } from '../src/chats/role/role.module';
import { UserChatModule } from '../src/chats/user-chat/user-chat.module';
import { GameModule } from '../src/pong/game/game.module';
import { UserChat } from '../src/chats/user-chat/entities/user-chat.entity';
import { Role } from '../src/chats/role/entities/role.entity';
import { User } from '../src/users/user/entities/user.entity';
import { Game } from '../src/pong/game/entities/game.entity';
import { UserController } from '../src/users/user/user.controller';
import { AuthModule } from '../src/auth/auth.module';
import { SharedModule } from '../src/shared/shared.module';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';

describe('message e2e', () => {
	let chatController: ChatController;
	let userController: UserController;
	let messageService: MessageService;
	let chatService: ChatService;
	let testingModule: TestingModule;
	let app: INestApplication;
	let messageController: MessageController;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];
	const chatIds = [];

	const testUsers = [
		{
			name: 'u1',
			password: 'p1',
			password_confirm: 'p1',
		},
		{
			name: 'u2',
			password: 'p2',
			password_confirm: 'p2',
		},
		{
			name: 'u3',
			password: 'p3',
			password_confirm: 'p3',
		},
	];

	let userIds = [];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([UserChat, Role, User, Chat, Game, Message]),
				UserModule,
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
			controllers: [MessageController, ChatController],
			providers: [MessageService, ChatService],
		}).compile();

		app = testingModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		messageController = testingModule.get<MessageController>(MessageController);
		chatController = testingModule.get<ChatController>(ChatController);
		userController = testingModule.get<UserController>(UserController);
		messageService = testingModule.get<MessageService>(MessageService);
		chatService = testingModule.get<ChatService>(ChatService);
		// seed db with animals for each testcase
		for (const chat in testChats) {
			await chatController
				.create(testChats[chat])
				.then((chat) => chatIds.push(chat.identifiers[0].id));
		}
		for (const user in testUsers) {
			await userController
				.create(testUsers[user])
				.then((user) => userIds.push(user.identifiers[0].id));
		}

		const testMessages: CreateMessageDto[] = [
			{ sender_id: userIds[0], chat_id: chatIds[0], content: 'hello' },
			{ sender_id: userIds[1], chat_id: chatIds[1], content: 'world!' },
		];

		for (const message in testMessages) {
			await messageController.create(testMessages[message]);
		}
		// console.log(await messageController.findAll());
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