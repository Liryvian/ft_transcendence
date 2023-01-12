import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { UserController } from '../../user/user.controller';
import { UserService } from '../../user/user.service';
import { SharedModule } from '../../shared/shared.module';
import { RegisterUserDto } from '../../user/dto/register-user.dto';
import { CreateMatchmakingRequestDto } from './dto/create-matchmaking-request.dto';
import { JwtService } from '@nestjs/jwt';

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
		await userService.create(mockUsers);

		seededUsers = await userService.findAll({
			relations: { matchmaking_request: true },
		});

		for (let i = 0; i < seededUsers.length; i++) {
			await mmrService.create({ user: seededUsers[i].id });
		}
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([MatchmakingRequest, User]),
				// SharedModule, // import for the JwtService
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
				mmrService.create({ user: nonExistantUserId }),
			).rejects.toThrow('FOREIGN KEY constraint failed');
		});

		it('should throw when trying to join with user that already has a gameRequest', async () => {
			const nonExistantUserId: number = 1;
			await expect(
				mmrService.create({ user: nonExistantUserId }),
			).rejects.toThrow(
				'UNIQUE constraint failed: matchmaking-requests.userId',
			);
		});
	});
});
