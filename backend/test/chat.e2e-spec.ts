import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateChatDto } from '../src/chats/chat/dto/create-chat.dto';
import { ChatController } from '../src/chats/chat/chat.controller';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { ChatModule } from '../src/chats/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Chat } from '../src/chats/chat/entities/chat.entity';
import { UserModule } from '../src/users/user/user.module';
import { UserChatModule } from '../src/chats/user-chat/user-chat.module';
import { AuthModule } from '../src/auth/auth.module';
import { SharedModule } from '../src/shared/shared.module';
import { AnimalModule } from '../src/test_example/animal.module';
import { MessageModule } from '../src/chats/message/message.module';
import { RoleModule } from '../src/chats/role/role.module';
import { GameModule } from '../src/pong/game/game.module';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';

describe('chat e2e', () => {
	let app: INestApplication;
	let chatController: ChatController;
	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const MockChat: CreateChatDto = {
		name: 'C',
		visibility: 'Indeed',
		password: 'C',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
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
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		chatController = moduleFixture.get<ChatController>(ChatController);

		// seed db with animals for each testcase
		for (const chat in testChats) {
			await chatController.create(testChats[chat]);
		}
	});

	afterAll(async () => {
		const chats: Chat[] = await chatController.findAll();

		for (let index = 0; index < chats.length; index++) {
			await chatController.remove(chats[index].id);
		}
		await app.close();
	});

	describe('/chats (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/chats').expect(HttpStatus.OK);
		});
	});
});