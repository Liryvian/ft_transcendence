import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

import { AllTestingModule } from '../shared/test.module';
import { IntraTokendata } from './dto/intra-tokendata.dto';
import { UserService } from '../users/user/user.service';

describe('Auth', () => {
	let authController: AuthController;
	let authService: AuthService;
	let authGuard: AuthGuard;
	let userService: UserService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		authGuard = module.get<AuthGuard>(AuthGuard);
		userService = module.get<UserService>(UserService);
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

	describe('Api register/login flow', () => {
		const fakeUserData = {
			id: 22346,
			login: 'fakeintrauser',
		};
		const fakeTokenData: IntraTokendata = {
			token_type: 'bearer',
			access_token: 'access_token',
			refresh_token: 'refresh_token',
			scope: 'scope',
			expires_in: 1000,
			created_at: 1706101614,
		};

		describe('for existing user', () => {
			it('should redirect to dashboard and not update name', async () => {
				await userService.create({
					name: 'not_fakeintrauser',
					intra_id: fakeUserData.id,
				});

				const redirect = await authController.processUserData(
					fakeUserData,
					fakeTokenData,
				);
				expect(redirect).toContain('recurring_user');
				const users = await userService.findAll({
					where: { intra_id: fakeUserData.id },
				});
				expect(users).toHaveLength(1);
				expect(users[0].name).toBe('not_fakeintrauser');
				await userService.remove(users[0].id);
			});
		});

		describe('for new user', () => {
			it('should create a new user and return a redirect to profile', async () => {
				const redirect = await authController.processUserData(
					fakeUserData,
					fakeTokenData,
				);
				expect(redirect).toContain('new_user');
				const users = await userService.findAll({
					where: { intra_id: fakeUserData.id },
				});
				expect(users).toHaveLength(1);
				expect(users[0].name).toBe(fakeUserData.login);
				await userService.remove(users[0].id);
			});
		});
	});
});
