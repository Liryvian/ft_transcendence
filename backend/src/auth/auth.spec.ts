import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AllTestingModule } from '../shared/test.module';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { UserService } from '../users/user/user.service';
import { ILike } from 'typeorm';
import { User } from '../users/user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('Auth', () => {
	let authController: AuthController;
	let authService: AuthService;
	let userService: UserService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
	});

	afterAll(() => {});

	describe('Auth-Guard/Controller/Service', () => {
		it('should be defined', () => {
			expect(authController).toBeDefined();
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
				await userService.insert({
					name: 'not_fakeintrauser',
					intra_id: fakeUserData.id,
				});

				const { redirectLocation, user } = await authService.processUserData(
					fakeUserData,
				);
				expect(redirectLocation).toContain('profiles');
				const users = await userService.findAll({
					where: { intra_id: fakeUserData.id },
				});
				expect(users).toHaveLength(1);
				expect(users[0].name).toBe('not_fakeintrauser');
				expect(users[0].id).toBe(user.id);
				await userService.remove(users[0].id);
			});
		});

		describe('for new user', () => {
			it('should create a new user and return a redirect to profile', async () => {
				const { redirectLocation, user } = await authService.processUserData(
					fakeUserData,
				);
				expect(redirectLocation).toContain('settings');
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
				const u0 = await userService.insert({
					name: fakeUserData.login,
					password: 'abc',
					is_intra: false,
				});

				// create api user with normal user name collision
				// name should be prefixed with intra id
				const u1 = await authService.processUserData(fakeUserData);

				// create user with same username but different id
				const u2 = await authService.processUserData({
					...fakeUserData,
					id: 2091,
				});

				// create a 'non-intra' user with the username
				// that would be generated if it was an intra user...
				const u3 = await userService.insert({
					name: fakeUserData.login + '_2091_4894',
					password: 'p',
					is_intra: false,
				});

				// make a collision on login name + id (user from above)
				// should generate random bytes after name
				const u4 = await authService.processUserData({
					login: 'fakeintrauser_2091',
					id: 4894,
				});

				// create an expected object
				const expectation = [
					{
						name: fakeUserData.login,
						id: u0.identifiers[0].id,
					},
					{
						name: fakeUserData.login + '_22346',
						id: u1.user.id,
					},
					{
						name: fakeUserData.login + '_2091',
						id: u2.user.id,
					},
					{
						name: fakeUserData.login + '_2091_4894',
						id: u3.identifiers[0].id,
					},
					{
						name: expect.stringMatching(
							/^fakeintrauser_2091_4894_[a-fA-F0-9]{1,8}$/,
						),
						id: u4.user.id,
					},
				];
				const usersMatchingUsername: User[] = await userService.findAll({
					where: { name: ILike('fakeintrause%') },
				});
				expect(usersMatchingUsername).toHaveLength(5);

				const dataToVerify = usersMatchingUsername.map((user: User) => ({
					name: user.name,
					id: user.id,
				}));
				expect(dataToVerify).toEqual(expectation);
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
