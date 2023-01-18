import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { RoleController } from '../src/chats/role/role.controller';
import { CreateRoleDto } from '../src/chats/role/dto/create-role.dto';
import { RoleModule } from '../src/chats/role/role.module';
import { UserChatModule } from '../src/chats/user-chat/user-chat.module';
import { UserModule } from '../src/users/user/user.module';
import { ChatModule } from '../src/chats/chat/chat.module';
import { Role } from '../src/chats/role/entities/role.entity';
import { RoleService } from '../src/chats/role/role.service';
import { MessageModule } from '../src/chats/message/message.module';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { UserChat } from '../src/chats/user-chat/entities/user-chat.entity';
import { User } from '../src/users/user/entities/user.entity';
import { Chat } from '../src/chats/chat/entities/chat.entity';
import { Game } from '../src/pong/game/entities/game.entity';
import { Message } from '../src/chats/message/entities/message.entity';
import { GameModule } from '../src/pong/game/game.module';
import { AuthModule } from '../src/auth/auth.module';
import { SharedModule } from '../src/shared/shared.module';
import { AnimalModule } from '../src/test_example/animal.module';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';

describe('role e2e', () => {
	let app: INestApplication;
	let roleController: RoleController;
	const testRoles: CreateRoleDto[] = [{ name: 'master' }, { name: 'philly' }];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
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
			controllers: [RoleController],
			providers: [RoleService],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		roleController = moduleFixture.get<RoleController>(RoleController);

		// seed db with animals for each testcase
		for (const role in testRoles) {
			await roleController.create(testRoles[role]);
		}
	});

	afterAll(async () => {
		const roles: Role[] = await roleController.findAll();

		for (let index = 0; index < roles.length; index++) {
			await roleController.remove(roles[index].id);
		}
		await app.close();
	});

	describe('/roles (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/roles').expect(HttpStatus.OK);
		});
	});
});
