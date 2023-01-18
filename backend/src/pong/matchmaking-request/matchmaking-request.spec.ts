import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { ChatModule } from '../../chats/chat/chat.module';
import { Game } from '../game/entities/game.entity';
import { GameInvite } from '../game_invite/entities/game-invite.entity';
import { GameInvitesModule } from '../game_invite/game-invite.module';
import { GameModule } from '../game/game.module';
import { JwtService } from '@nestjs/jwt';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { MatchmakingRequestModule } from './matchmaking-request.module';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { MessageModule } from '../../chats/message/message.module';
import { RegisterUserDto } from '../../users/user/dto/register-user.dto';
import { RoleModule } from '../../chats/role/role.module';
import { SharedModule } from '../../shared/shared.module';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { User } from '../../users/user/entities/user.entity';
import { UserChatModule } from '../../chats/user-chat/user-chat.module';
import { UserController } from '../../users/user/user.controller';
import { UserModule } from '../../users/user/user.module';
import { UserService } from '../../users/user/user.service';

describe('MatchmakingRequestService', () => {
	let mmrService: MatchmakingRequestService;
	let controller: MatchmakingRequestController;
	let userController: UserController;
	let userService: UserService;
	let seededUsers: User[];

	let mockUsers: RegisterUserDto[] = [
		{ name: 'Johnno', password: 'x', password_confirm: 'x' },
		{ name: 'Joanna', password: 'y', password_confirm: 'y' },
	];

	async function seed() {
		await userService.save(mockUsers);

		seededUsers = await userService.findAll({
			relations: { matchmaking_request: true },
		});

		for (let i = 0; i < seededUsers.length; i++) {
			await mmrService.save({ user: seededUsers[i].id });
		}
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([MatchmakingRequest, User, Game, GameInvite]),
				AuthModule,
				ChatModule,
				GameInvitesModule,
				GameModule,
				MatchmakingRequestModule,
				MessageModule,
				RoleModule,
				SharedModule, // import for the JwtService
				UserChatModule,
				UserModule,
			],
			providers: [MatchmakingRequestService, UserService, JwtService],
			controllers: [MatchmakingRequestController, UserController],
		}).compile();

		mmrService = module.get<MatchmakingRequestService>(
			MatchmakingRequestService,
		);
		controller = module.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);
		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);

		await seed();
	});

	afterAll(async () => {
		const allRequests: MatchmakingRequest[] = await mmrService.findAll({
			relations: { user: true },
		});

		for (let i = 0; i < allRequests.length; i++) {
			await mmrService.remove(allRequests[i].id);
		}
		for (let i = 0; i < seededUsers.length; ++i) {
			await userService.remove(seededUsers[i].id);
		}
	});

	it('should be defined', () => {
		expect(mmrService).toBeDefined();
		expect(controller).toBeDefined();
		expect(userController).toBeDefined();
	});

	describe('findAll', () => {
		it('should have been created with a relation to user', async () => {
			const matchRequests: MatchmakingRequest[] = await mmrService.findAll({
				relations: { user: true },
			});
			expect(matchRequests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						created_at: expect.any(Date),
						updated_at: expect.any(Date),
						user: expect.any(User),
					}),
				]),
			);
		});
	});

	describe('create', () => {
		it('should throw when trying to join with user that does not exist', async () => {
			const nonExistantUserId: number = 9999;
			await expect(
				mmrService.save({ user: nonExistantUserId }),
			).rejects.toThrow('FOREIGN KEY constraint failed');
		});

		it('should throw when trying to join with user that already has a gameRequest', async () => {
			const nonExistantUserId: number = 1;
			await expect(
				mmrService.save({ user: nonExistantUserId }),
			).rejects.toThrow(
				'UNIQUE constraint failed: matchmaking_requests.invite_users',
			);
		});
	});
});
