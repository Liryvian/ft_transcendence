import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ChatService } from '../chat/chat.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatController } from '../chat/chat.controller';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { AnimalModule } from '../../test_example/animal.module';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from './message.module';
import { RoleModule } from '../role/role.module';
import { GameModule } from '../../pong/game/game.module';
import { UserChatModule } from '../user-chat/user-chat.module';
import { GameInvitesModule } from '../../pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../../pong/matchmaking-request/matchmaking-request.module';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { InsertResult } from 'typeorm';
import { UserController } from '../../users/user/user.controller';
import { UserService } from '../../users/user/user.service';

describe('MessageController', () => {
	let messageController: MessageController;
	let chatController: ChatController;
	let messageService: MessageService;
	let chatService: ChatService;
	let testingModule: TestingModule;
	let userController: UserController;
	let userService: UserService;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const testMessages: CreateMessageDto[] = [
		{ sender_id: 1, chat_id: 1, content: 'hello' },
		{ sender_id: 2, chat_id: 2, content: 'world!' },
	];

	let seedUsers = [
		{ name: 'DefaultUsr', password: 'Password for default user', userId: -1 },
		{ name: 'secondUser', password: 'Second users password', userId: -1 },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Message, Chat]),
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

		messageController = testingModule.get<MessageController>(MessageController);
		chatController = testingModule.get<ChatController>(ChatController);

		messageService = testingModule.get<MessageService>(MessageService);
		chatService = testingModule.get<ChatService>(ChatService);

		userController = testingModule.get<UserController>(UserController);
		userService = testingModule.get<UserService>(UserService);

		// create one or two users that will exist till the "end" (once ready)

		for (const chat in testChats) {
			await chatController.create(testChats[chat]);
		}

		for (let index = 0; index < seedUsers.length; index++) {
			const data: CreateUserDto = {
				name: seedUsers[index].name,
				password: seedUsers[index].password,
				is_intra: false,
			};
			const newUserResult: InsertResult = await userService.create(data);
			seedUsers[index].userId = newUserResult.identifiers[0].id;
		}

		for (const message in testMessages) {
			await messageController.create(testMessages[message]);
		}
	});

	afterAll(async () => {
		const repoOfMessages: Message[] = await messageController.findAll();
		for (let i = 0; i < repoOfMessages.length; i++) {
			await messageController.remove(i + 1);
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
