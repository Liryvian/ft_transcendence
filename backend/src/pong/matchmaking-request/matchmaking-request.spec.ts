import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { RegisterUserDto } from '../../users/user/dto/register-user.dto';
import { User } from '../../users/user/entities/user.entity';
import { UserController } from '../../users/user/user.controller';
import { UserService } from '../../users/user/user.service';
import { AllTestingModule } from '../../shared/test.module';
import { CreateMatchmakingRequestDto } from './dto/create-matchmaking-request.dto';

describe('MatchmakingRequestService', () => {
	let mmrService: MatchmakingRequestService;
	let controller: MatchmakingRequestController;
	let userController: UserController;
	let userService: UserService;
	let seededUsers: User[];

	const mockUsers: RegisterUserDto[] = [
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
			imports: [AllTestingModule],
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
			const nonExistantUserId: CreateMatchmakingRequestDto = { user: 9999 };
			await expect(controller.save(nonExistantUserId)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw when trying to join with user that already has a gameRequest', async () => {
			const duplicateIdInvite: CreateMatchmakingRequestDto = { user: 9999 };
			await expect(controller.save(duplicateIdInvite)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
