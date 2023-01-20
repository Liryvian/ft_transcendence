import { Test, TestingModule } from '@nestjs/testing';
import {
	ArgumentMetadata,
	NotFoundException,
	ValidationPipe,
} from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { globalValidationPipeOptions } from '../../main.validationpipe';

import { AuthGuard } from '../../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Game } from '../../pong/game/entities/game.entity';
import { GameService } from '../../pong/game/game.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AllTestingModule } from '../../shared/test.module';

describe('User', () => {
	let controller: UserController;
	let service: UserService;
	let testingModule: TestingModule;
	let gameService: GameService;

	let seedUsers = [
		{
			name: 'DefaultUsr',
			password: 'Password for default user',
			userId: -1,
			games: [],
		},
		{
			name: 'secondUser',
			password: 'Second users password',
			userId: -1,
			games: [],
		},
		{ name: 'third', password: 'Third users password', userId: -1, games: [] },
		{ name: '4th', password: 'fourth users password', userId: -1, games: [] },
	];
	let gameIds: number[] = [];

	beforeAll(async () => {
		const mock_guard = { CanActivate: jest.fn(() => true) };

		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		})
			.overrideGuard(AuthGuard)
			.useValue(mock_guard)
			.compile();

		controller = testingModule.get<UserController>(UserController);
		service = testingModule.get<UserService>(UserService);
		gameService = testingModule.get<GameService>(GameService);

		// create users
		const userDtos: CreateUserDto[] = seedUsers.map((obj) => {
			return <CreateUserDto>{
				name: obj.name,
				password: obj.password,
				is_intra: false,
			};
		});
		await service.create(userDtos).then((res: InsertResult) => {
			res.identifiers.forEach((el, i) => {
				seedUsers[i].userId = el.id;
			});
			return res;
		});

		await gameService
			.save([
				{ player_one: seedUsers[0].userId, player_two: seedUsers[1].userId },
				{ player_one: seedUsers[2].userId, player_two: seedUsers[0].userId },
				{ player_one: seedUsers[1].userId, player_two: seedUsers[2].userId },
				{ player_one: seedUsers[2].userId, player_two: seedUsers[3].userId },
			])
			.then((games: unknown) => {
				const g: Game[] = games as Game[];
				g.forEach((el) => {
					gameIds.push(el.id);
				});
			});
		// the result of the `save` method does not return _with_ relations...
		const allGames: Game[] = await gameService.findAll({
			relations: ['player_one', 'player_two'],
		});
		allGames.forEach((game) => {
			seedUsers.forEach((usr) => {
				if (
					usr.userId === game.player_one.id ||
					usr.userId === game.player_two.id
				) {
					usr.games.push(game.id);
				}
			});
		});
	});

	describe('DTO', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());
		const transformValidator = new ValidationPipe({
			transform: true,
			whitelist: true,
		});
		describe('registerUserDto', () => {
			const registerUserMeta: ArgumentMetadata = {
				type: 'body',
				metatype: RegisterUserDto,
			};

			it('should require a username', async () => {
				const data: RegisterUserDto = {
					name: '',
					password: 'a',
					password_confirm: 'a',
				};
				try {
					await validator.transform(data, registerUserMeta);
				} catch (e) {
					expect(e.response).toEqual(
						expect.objectContaining({
							statusCode: 400,
							message: expect.arrayContaining([
								expect.stringContaining('name should not be empty'),
							]),
						}),
					);
				}
			});

			it('should fail on non matching password and password_confirm', async () => {
				const data: RegisterUserDto = {
					name: 'valid_username',
					password: 'p1',
					password_confirm: 'p2',
				};
				try {
					await validator.transform(data, registerUserMeta);
				} catch (e) {
					expect(e.response).toEqual(
						expect.objectContaining({
							statusCode: 400,
							message: expect.arrayContaining([
								expect.stringContaining('password and password_confirm'),
							]),
						}),
					);
				}
			});
		});

		describe('createUserDto', () => {
			const createUserMeta: ArgumentMetadata = {
				type: 'body',
				metatype: CreateUserDto,
			};

			it('should set a default value for is_intra', async () => {
				const data: CreateUserDto = {
					name: 'name',
					password: 'hashed',
				};
				await expect(
					transformValidator.transform(data, createUserMeta),
				).resolves.toEqual(
					expect.objectContaining({
						is_intra: false,
					}),
				);
			});
		});

		describe('updateUserDto', () => {
			const updateUserMeta: ArgumentMetadata = {
				type: 'body',
				metatype: UpdateUserDto,
			};

			it('should require both a password confirm and the current password when setting a password', async () => {
				const data: UpdateUserDto = {
					new_password: 'new_pass',
					new_password_confirm: 'new_pass',
					password: 'old_pass',
				};
				await expect(
					transformValidator.transform(data, updateUserMeta),
				).resolves.toEqual(
					expect.objectContaining({
						new_password: data.new_password,
						new_password_confirm: data.new_password_confirm,
						password: data.password,
					}),
				);
			});

			it('should throw an error if no current password when updating password', async () => {
				const data: UpdateUserDto = {
					new_password: 'new',
					new_password_confirm: 'new',
				};

				try {
					await validator.transform(data, updateUserMeta);
				} catch (e) {
					expect(e.response).toEqual(
						expect.objectContaining({
							statusCode: 400,
							message: expect.arrayContaining([
								expect.stringContaining('password should not be empty'),
							]),
						}),
					);
				}
			});

			it('allow only updating username', async () => {
				const data: UpdateUserDto = {
					name: 'new_username',
				};

				await expect(
					validator.transform(data, updateUserMeta),
				).resolves.toEqual(
					expect.objectContaining({
						name: data.name,
					}),
				);
			});
		});
	});

	describe('UserService', () => {
		it('should be defined', () => {
			expect(service).toBeDefined();
		});

		describe('Relationship to games', () => {
			it('should return a single game attached to a userId', async () => {
				const usersGames: Game[] = (
					await controller.findOne(seedUsers[3].userId)
				).games;
				expect(usersGames.length).toBe(1);
				expect(usersGames[0].id).toBe(4);
			});

			it('should return an array of games attached to a userId', async () => {
				const usersGames: Game[] = (
					await controller.findOne(seedUsers[2].userId)
				).games;
				expect(usersGames.length).toBe(3);
				expect(usersGames).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							id: 2,
						}),
						expect.objectContaining({
							id: 3,
						}),
						expect.objectContaining({
							id: 4,
						}),
					]),
				);
			});

			it('should return the user object with the relation to games', async () => {
				const userWithGames = (await controller.findOne(seedUsers[2].userId))
					.games;
				const usersGameIds = userWithGames.map((game) => game.id);

				usersGameIds.sort();

				expect(usersGameIds).toEqual(seedUsers[2].games);
			});

			test('should return array of users with relation to games', async () => {
				const usersWithGames = await controller.findAll();
				const map_output_to_values_to_test = usersWithGames.map((u) => ({
					id: u.id,
					games: u.games.map((g) => g.id).sort(),
				}));
				const map_users_to_test_values = seedUsers.map((u) => ({
					id: u.userId,
					games: u.games,
				}));

				expect(map_output_to_values_to_test).toEqual(map_users_to_test_values);
			});
		});

		describe('Database constraint for unique usernames', () => {
			it('throws on create with duplicate usernames', async () => {
				await expect(
					service.create({
						name: seedUsers[0].name,
						password: seedUsers[0].password + 'a',
						is_intra: false,
					}),
				).rejects.toThrow('UNIQUE constraint failed');
			});

			it('throws on update with duplicate usernames', async () => {
				await expect(
					service.update(seedUsers[0].userId, { name: seedUsers[1].name }),
				).rejects.toThrow('UNIQUE constraint failed');
			});
		});
	});

	describe('UserController', () => {
		it('should be defined', () => {
			expect(controller).toBeDefined();
		});

		it('should get all users', async () => {
			await expect(controller.findAll()).resolves.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: seedUsers[0].name,
						password: seedUsers[0].password,
						is_intra: false,
						id: expect.any(Number),
						created_at: expect.any(Date),
						updated_at: expect.any(Date),
					}),
					expect.objectContaining({
						name: seedUsers[1].name,
						password: seedUsers[1].password,
						is_intra: false,
						id: expect.any(Number),
						created_at: expect.any(Date),
						updated_at: expect.any(Date),
					}),
				]),
			);
		});

		it('should get a specific user based on its ID', async () => {
			await expect(controller.findOne(seedUsers[0].userId)).resolves.toEqual(
				expect.objectContaining({
					name: seedUsers[0].name,
					password: seedUsers[0].password,
					is_intra: false,
					id: seedUsers[0].userId,
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
				}),
			);
		});

		it('should fail update non existing', async () => {
			await expect(controller.update(9999, { name: 'kees' })).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should fail if you try to update to an existing username', async () => {
			await expect(
				controller.update(seedUsers[1].userId, { name: seedUsers[0].name }),
			).rejects.toThrow('Please pick a different username');
		});

		it('should not create user with duplicate username', async () => {
			const allUsers: User[] = await controller.findAll();
			const duplicateUsernameUser: RegisterUserDto = {
				name: allUsers[0].name,
				password: 'foo',
				password_confirm: 'foo',
			};
			await expect(controller.create(duplicateUsernameUser)).rejects.toThrow(
				'Please pick a different username',
			);
		});
	});
});
