import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';

import { InsertResult } from 'typeorm';
import { UserController } from '../users/user/user.controller';
import { UserService } from '../users/user/user.service';
import { User } from '../users/user/entities/user.entity';
import {UserModule} from "../users/user/user.module";
import {ChatModule} from "../chats/chat/chat.module";
import {AuthModule} from "./auth.module";
import {SharedModule} from "../shared/shared.module";
import {AnimalModule} from "../test_example/animal.module";
import {MessageModule} from "../chats/message/message.module";
import {RoleModule} from "../chats/role/role.module";
import {GameModule} from "../pong/game/game.module";
import {UserChatModule} from "../chats/user-chat/user-chat.module";
import {GameInvitesModule} from "../pong/game_invite/game-invite.module";
import {MatchmakingRequestModule} from "../pong/matchmaking-request/matchmaking-request.module";

describe('Auth', () => {
	let authController: AuthController;
	let userController: UserController;
	let authService: AuthService;
	let userService: UserService;

	let users = [
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

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([User]),
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
			controllers: [AuthController, UserController],
			providers: [AuthService, UserService, JwtService],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);

		await userController
			.create(users[0])
			.then((res: InsertResult) => (users[0]['id'] = res.identifiers[0].id));
		await userController
			.create(users[1])
			.then((res: InsertResult) => (users[1]['id'] = res.identifiers[0].id));
		await userController
			.create(users[2])
			.then((res: InsertResult) => (users[2]['id'] = res.identifiers[0].id));
	});

	afterAll(() => {
		userService.remove(users.map((obj) => obj['id']));
	});

	describe('AuthGuard', () => {
		it('should be defined', () => {
			expect(new AuthGuard(new JwtService())).toBeDefined();
		});
	});

	describe('AuthController', () => {
		it('should be defined', () => {
			expect(authController).toBeDefined();
		});
	});

	describe('AuthService', () => {
		it('should be defined', () => {
			expect(authService).toBeDefined();
		});
	});
});
