import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { UserModule } from '../src/users/user/user.module';
import { GameModule } from '../src/pong/game/game.module';
import { User } from '../src/users/user/entities/user.entity';
import { UserService } from '../src/users/user/user.service';
import { AuthGuard } from '../src/auth/auth.guard';
import { InsertResult } from 'typeorm';
import { SharedModule } from '../src/shared/shared.module';
import { ChatModule } from '../src/chats/chat/chat.module';
import { MessageModule } from '../src/chats/message/message.module';
import { RoleModule } from '../src/chats/role/role.module';
import { UserChatModule } from '../src/chats/user-chat/user-chat.module';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';

describe('User (e2e)', () => {
	let app: INestApplication;
	let userService: UserService;

	const userIds = [];

	beforeAll(async () => {
		const mock_guard = { CanActivate: jest.fn(() => true) };

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				UserModule,
				GameModule,
				SharedModule,
				ChatModule,
				MessageModule,
				RoleModule,
				UserChatModule,
				GameInvitesModule,
				MatchmakingRequestModule,
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mock_guard)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		userService = moduleFixture.get<UserService>(UserService);

		await userService
			.create([
				{ name: 'n1', password: 'p1' },
				{ name: 'n2', password: 'p2' },
			])
			.then((users: InsertResult) => {
				users.identifiers.forEach((identifier) => {
					userIds.push(identifier.id);
				});
			});
	});

	afterAll(async () => {
		const allUsers: User[] = await userService.findAll();

		if (allUsers.length) {
			userService.remove(allUsers.map((user) => user.id));
		}
		app.close();
	});

	describe('/users/:id/avatar', () => {
		describe('POST', () => {
			it('should save a new image as the current user', async () => {
				const response = await request(app.getHttpServer())
					.post(`/users/${userIds[0]}/avatar`)
					.attach('avatar', './test/test-avatar.png');

				expect(response.status).toBe(HttpStatus.CREATED);
				expect(response.body.avatar).toEqual(
					expect.stringContaining('u1_avatar.png'),
				);
				return response;
			});

			it('should not allow another extention than jpg/png/jpeg', async () => {
				const response = await request(app.getHttpServer())
					.post(`/users/${userIds[1]}/avatar`)
					.attach('avatar', './test/dotenv-config.ts')
					.expect(HttpStatus.BAD_REQUEST);
			});
		});
		describe('DELETE', () => {
			it('should remove the users avatar', async () => {
				await request(app.getHttpServer())
					.post(`/users/${userIds[1]}/avatar`)
					.attach('avatar', './test/test-avatar.png');

				const response = await request(app.getHttpServer()).delete(
					`/users/${userIds[1]}/avatar`,
				);
				expect(response.status).toBe(HttpStatus.OK);

				const user: User = await userService.findOne({
					where: { id: userIds[1] },
				});
				expect(user.avatar).toBe(null);
			});
		});
	});

	describe('/users (GET)', () => {
		it('should return an array of all users', () => {
			return request(app.getHttpServer()).get('/users').expect(HttpStatus.OK);
		});
	});
});
