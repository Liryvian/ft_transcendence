import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';

import { AuthModule } from './auth.module';
import { Chat } from '../chats/chat/entities/chat.entity';
import { Game } from '../pong/game/entities/game.entity';
import { GameInvite } from '../pong/game_invite/entities/game-invite.entity';
import { MatchmakingRequest } from '../pong/matchmaking-request/entities/matchmaking-request.entity';
import { Message } from '../chats/message/entities/message.entity';
import { Role } from '../chats/role/entities/role.entity';
import { SharedModule } from '../shared/shared.module';
import { User } from '../users/user/entities/user.entity';
import { UserChat } from '../chats/user-chat/entities/user-chat.entity';
import { UserModule } from '../users/user/user.module';

describe('Auth', () => {
	let authController: AuthController;
	let authService: AuthService;
	let authGuard: AuthGuard;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
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
				UserModule,
			],
			controllers: [AuthController],
			providers: [AuthService],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		authGuard = module.get<AuthGuard>(AuthGuard);
	});

	afterAll(() => {});

	describe('AuthGuard', () => {
		it('should be defined', () => {
			expect(authGuard).toBeDefined();
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
