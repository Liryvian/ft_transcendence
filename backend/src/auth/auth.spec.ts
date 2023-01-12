import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';
import { InsertResult } from 'typeorm';
import { MatchmakingRequest } from '../pong/matchmaking-request/entities/matchmaking-request.entity';

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
				TypeOrmModule.forFeature([User, MatchmakingRequest]),
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
