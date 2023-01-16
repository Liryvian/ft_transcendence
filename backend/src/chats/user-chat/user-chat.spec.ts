import { Test, TestingModule } from '@nestjs/testing';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';
import { UserController } from '../../users/user/user.controller';
import { UserService } from '../../users/user/user.service';
import { ChatController } from '../chat/chat.controller';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { Message } from '../message/entities/message.entity';
import { Chat } from '../chat/entities/chat.entity';
import { UserChat } from './entities/user-chat.entity';

describe('UserChatController', () => {
	let userChatcontroller: UserChatController;
	let userChatService: UserChatService;
	let userController: UserController;
	let userService: UserService;
	let chatController: ChatController;
	let chatService: ChatService;
	let testingModule: TestingModule;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const testUsers: CreateUserDto[] = [{ name: 'A' }, { name: 'B' }];

	// const testChats: CreateUserChatDto[] = [
	//     {  },
	//     {  },
	// ];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Message, Chat, UserChat]),
			],
			controllers: [UserChatController, ChatController, UserController],
			providers: [UserChatService, ChatService, UserChatService],
		}).compile();

		userController = testingModule.get<UserController>(UserController);
		chatController = testingModule.get<ChatController>(ChatController);
		userService = testingModule.get<UserService>(UserService);
		chatService = testingModule.get<ChatService>(ChatService);

		for (const chat in testChats) {
			await chatController.create(testChats[chat]);
		}

		for (const user in testUsers) {
			await userController.create(testUsers[user]);
		}

		// for (const chatUser in testChatUsers) {
		// 	await chatUserController.create(testUsers[chatUser]);
		// }
	});

	it('should be defined', () => {
		expect(userChatcontroller).toBeDefined();
		expect(userChatService).toBeDefined();
	});

	// !! these need to be finished
	// it('Check chat_id and user_id exist', async () => {
	//     const allUserChats: UserChat[] = await userChatController.findAll();
	//     expect(allUserChats).toHaveLength(2);
	//     console.log(allUserChats);
	//     console.table(allUserChats);
	//     for (let index = 0; index < allUserChats.length; index++) {
	//         expect(allUserChats).toEqual(
	//             expect.arrayContaining([
	//                 expect.objectContaining({
	//                     id: expect.any(Number),
	//                     chat_id: expect.objectContaining({
	//                         id: testUserChats[index].chat_id,
	//                     }),
	//                     created_at: expect.any(Date),
	//                     updated_at: expect.any(Date),
	//                     content: testUserChats[index].content,
	//                 }),
	//             ]),
	//         );
	//     }
	// });
	//
	// it('Get a specific userChat', async () => {
	//     const specificUserChat = 1;
	//     const userChat: UserChat = await userChatController.findOne(specificUserChat);
	//     expect(userChat.id).toBe(specificUserChat);
	// });

	//check if chat_id en user_id update
});
