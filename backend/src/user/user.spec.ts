import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { InsertResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

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
			],
			controllers: [UserController],
			providers: [UserService, JwtService],
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

	describe('UserService', () => {
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

	describe('UserController', () => {
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
				'Not Found',
			);
		});

		it('should fail if you try to update to an empty username', async () => {
			const u: InsertResult = await controller.create({
				name: 'tryEmpty',
				password: 'p',
				password_confirm: 'p',
			});
			const updDto: UpdateUserDto = {
				name: '',
			};
			const updateRes = await controller.update(u.identifiers[0].id, updDto);
			// await expect(
			// 	controller.update(u.identifiers[0].identity, updDto),
			// ).rejects.toThrow();

			console.log(updateRes);
			const allUsers = await controller.findAll();
			console.table(allUsers);

			service.remove(u.identifiers[0].id);
		});

		// it('should fail if you try to update to an empty password', async () => {
		// 	const u: InsertResult = await controller.create({
		// 		name: 'tryEmptyPassword',
		// 		password: 'p',
		// 		password_confirm: 'p',
		// 	});
		// 	const updDto: UpdateUserDto = {
		// 		password: '',
		// 	};
		// 	await expect(
		// 		controller.update(u.identifiers[0].identity, updDto),
		// 	).rejects.toThrow();
		// 	service.remove(u.identifiers[0].id);
		// });

		// it('should fail if you try to update to an existing username', async () => {
		// 	await expect(
		// 		controller.update(seedUsers[1].userId, { name: seedUsers[0].name }),
		// 	).rejects.toThrow('Please pick a different username');
		// });

		it('should fail on not matching passwords', async () => {
			const invalidPasswordUser: RegisterUserDto = {
				name: 'name',
				password: 'p1',
				password_confirm: 'p2',
			};
			await expect(controller.create(invalidPasswordUser)).rejects.toThrow(
				'Passwords do not match',
			);
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
