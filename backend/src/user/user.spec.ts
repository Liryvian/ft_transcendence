import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { InsertResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
	ArgumentMetadata,
	NotFoundException,
	ValidationPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { globalValidationPipeOptions } from '../main.validationpipe';
import { SharedModule } from '../shared/shared.module';
import fs from 'fs';

describe('User', () => {
	let controller: UserController;
	let service: UserService;
	let testingModule: TestingModule;

	let seedUsers = [
		{ name: 'DefaultUsr', password: 'Password for default user', userId: -1 },
		{ name: 'secondUser', password: 'Second users password', userId: -1 },
	];

	beforeAll(async () => {
		const mock_guard = { CanActivate: jest.fn(() => true) };

		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([User]),
				AuthModule,
				SharedModule,
			],
			controllers: [UserController],
			providers: [UserService],
		})
			.overrideGuard(AuthGuard)
			.useValue(mock_guard)
			.compile();

		controller = testingModule.get<UserController>(UserController);
		service = testingModule.get<UserService>(UserService);

		for (let index = 0; index < seedUsers.length; index++) {
			const data: CreateUserDto = {
				name: seedUsers[index].name,
				password: seedUsers[index].password,
				is_intra: false,
			};
			const newUserResult: InsertResult = await service.create(data);
			seedUsers[index].userId = newUserResult.identifiers[0].id;
		}
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

	describe('user can have an avatar', () => {
		it('should be an possible parameter in the user entity', () => {
			const repo: Repository<User> = service.getRepo();
			const user = repo.create({ avatar: '/url/test.jpg' });
			expect(user.avatar).toBeDefined();
			expect(user.avatar).toBe('/url/test.jpg');
		});

		describe('controller methods', () => {
			//   -- guess this is not possible since we don't have an authenticated user with this type of testing
			// it('should save the avatar to the current user', async () => {
			// 	await expect(controller.setAvatar('/url/test.jpg')).resolves.toEqual(
			// 		<UpdateResult>{},
			// 	);
			// });

			it('should save the avatar to a targetted user', async () => {
				const fileData = fs.readFileSync('./simple_avatar.png');

				const file = new File([fileData.buffer], 'simple_avatar.png');
				console.log(file);

				await expect(
					controller.setAvatar(seedUsers[1].userId, file),
				).resolves.toEqual<UpdateResult>(
					expect.objectContaining({
						affected: 1,
					}),
				);
				await expect(controller.findOne(seedUsers[1].userId)).resolves.toEqual(
					expect.objectContaining({
						avatar: url,
					}),
				);
			});

			it.todo('should update the users avatar');
			it.todo('should allow jpg files');
			it.todo('should allow png files');
			it.todo('should not allow other than jpg/png files');
		});
	});
});
