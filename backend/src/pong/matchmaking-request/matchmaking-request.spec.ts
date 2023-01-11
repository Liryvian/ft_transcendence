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

describe('MatchmakingRequestService', () => {
	let service: MatchmakingRequestService;
	let controller: MatchmakingRequestController;
	let userController: UserController;
	let userService: UserService;

	let mockUser: RegisterUserDto = {
		name: 'testUser',
		password: 'x',
		password_confirm: 'x',
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([MatchmakingRequest, User]),
				SharedModule, // import for the JwtService
			],
			providers: [MatchmakingRequestService, UserService],
			controllers: [MatchmakingRequestController, UserController],
		}).compile();

		service = module.get<MatchmakingRequestService>(MatchmakingRequestService);
		controller = module.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);
		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);
		await userController.create(mockUser);
	});

	afterAll(async () => {
		const allUsers: User[] = await userService.findAll({
			relations: { matchmaking_request: true },
		});
		const allRequests: MatchmakingRequest[] = await service.findAll({
			relations: { user: true },
		});

		for (let i = 0; i < allRequests.length; i++) {
			await service.remove(allRequests[i].id);
		}
		for (let i = 0; i < allUsers.length; ++i) {
			await userService.remove(allUsers[i].id);
		}
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
		expect(userController).toBeDefined();
	});

	describe('create', () => {
		it('should create a matchmaking_request with relation to user', async () => {
			let req: CreateMatchmakingRequestDto = { user: 1 };
			await controller.create(req);
		});
	});
});
