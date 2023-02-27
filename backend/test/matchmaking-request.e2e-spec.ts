import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateMatchmakingRequestDto } from '../src/pong/matchmaking-request/dto/create-matchmaking-request.dto';
import { MatchmakingRequestController } from '../src/pong/matchmaking-request/matchmaking-request.controller';
import { MatchmakingRequest } from '../src/pong/matchmaking-request/entities/matchmaking-request.entity';
import { UserService } from '../src/users/user/user.service';
import { CreateUserDto } from '../src/users/user/dto/create-user.dto';
import { AllTestingModule } from '../src/shared/test.module';
import AuthGuard from '../src/auth/auth.guard';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let matchmakingController: MatchmakingRequestController;
	let userService: UserService;

	const mockInvite: CreateMatchmakingRequestDto = {
		user: 2,
	};

	const mockUsers: CreateUserDto[] = [
		{ name: 'Renoster', password: 'R' },
		{ name: 'Flamink', password: 'F' },
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		})
			.overrideGuard(AuthGuard)
			.useValue({ validated: true })
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		userService = moduleFixture.get<UserService>(UserService);
		matchmakingController = moduleFixture.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);

		await userService.save(mockUsers);
		await matchmakingController.save(mockInvite);
	});

	afterAll(async () => {
		const allGames: MatchmakingRequest[] =
			await matchmakingController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await matchmakingController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('matchmaking-requests (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/matchmaking-requests')
				.expect(HttpStatus.OK);
		});
	});
});
