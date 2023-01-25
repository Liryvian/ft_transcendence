import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

import { AllTestingModule } from '../shared/test.module';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { UserService } from '../users/user/user.service';
import { ILike } from 'typeorm';
import { User } from '../users/user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

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
		const fakeTokenData: IntraTokendataDto = {
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

				const { redirectLocation, userId } = await authService.processUserData(
					fakeUserData,
				);
				expect(redirectLocation).toContain('recurring_user');
				const users = await userService.findAll({
					where: { intra_id: fakeUserData.id },
				});
				expect(users).toHaveLength(1);
				expect(users[0].name).toBe('not_fakeintrauser');
				expect(users[0].id).toBe(userId);
				await userService.remove(users[0].id);
			});
		});

		describe('for new user', () => {
			it('should create a new user and return a redirect to profile', async () => {
				const { redirectLocation, userId } = await authService.processUserData(
					fakeUserData,
				);
				expect(redirectLocation).toContain('new_user');
				const users = await userService.findAll({
					where: { intra_id: fakeUserData.id },
				});
				expect(users).toHaveLength(1);
				expect(users[0].name).toBe(fakeUserData.login);
				await userService.remove(users[0].id);
			});
		});

		describe('when other user with same name as new user intra_login exists', () => {
			it('should add a suffix to the new users displayname', async () => {
				await userService.create({
					name: fakeUserData.login,
					password: 'abc',
					is_intra: false,
				});

				const expectation = [{}, {}, {}, {}];

				// create 'normal' fake user with username `fakeintrauser`
				const u0 = await authService.processUserData(fakeUserData);
				expectation[0] = {
					name: fakeUserData.login,
					id: u0.userId,
				};

				// create user with same username but different id
				const u1 = await authService.processUserData({
					...fakeUserData,
					id: 2091,
				});
				expectation[1] = {
					name: fakeUserData.login + '_2091',
					id: u1.userId,
				};

				// create a 'non-intra' user with the username that would be generated if it was an intra user...
				const u2 = await userService.save({
					name: fakeUserData.login + '_2091_4894',
					password: 'p',
					is_intra: false,
				});
				expectation[2] = {
					name: fakeUserData.login + '_2091_4894',
					id: u2.id,
				};

				// make a collision on login name + id (user from above)
				const u3 = await authService.processUserData({
					login: 'fakeintrauser_2091',
					id: 4894,
				});
				expectation[3] = {
					name: /fakeintrauser_2091_4897_[a-zA-Z]/,
				};

				const usersMatchingUsername: User[] = await userService.findAll({
					where: { name: ILike('fakeintrauser%') },
				});

				expect(usersMatchingUsername).toHaveLength(4);
				expect(usersMatchingUsername.map((user: User) => user.name)).toEqual(
					expect.arrayContaining([
						fakeUserData.login,
						expect.stringContaining(fakeUserData.login + '_' + fakeUserData.id),
						expect.stringContaining(fakeUserData.login + '_' + 2091),
					]),
				);
			});
		});

		describe('validation of intra token response', () => {
			it('should validate a complete object', async () => {
				const validated = await authService.validateIntraTokenData(
					fakeTokenData,
				);
				expect(validated).toEqual(fakeTokenData);
			});

			it('should throw on incomplete object', async () => {
				const incomplete = {
					token_type: 'bearer',
					refresh_token: 'refresh_token',
					scope: 'scope',
					expires_in: 1000,
					created_at: 1706101614,
				};
				try {
					await authService.validateIntraTokenData(incomplete);
				} catch (e) {
					expect(e).toBeInstanceOf(BadRequestException);
				}
			});
		});
	});
});
