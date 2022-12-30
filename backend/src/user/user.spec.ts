import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('User', () => {
	let controller: UserController;
	let service: UserService;
	let testingModule: TestingModule;

	let seedUsers = [
		{ name: 'Default User', password: 'Password for default user', userId: -1 },
		{ name: 'second user', password: 'Second users password', userId: -1 },
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
			const newUser = await service.create(data);
			seedUsers[index].userId = newUser.id;
		}
	});

	const newUser: CreateUserDto = {
		name: 'Username for user',
		password: 'password for user',
		is_intra: false,
	};

	describe('UserService', () => {
		it('should create and delete a user', async () => {
			const createdUser: User = await service.create(newUser);
			expect(createdUser).toEqual(
				expect.objectContaining({
					name: expect.any(String),
					password: expect.any(String),
					is_intra: false,
					id: expect.any(Number),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
				}),
			);
			const deleteResult = await service.delete(createdUser.id);
			expect(deleteResult).toEqual(
				expect.objectContaining({
					raw: expect.any(Array),
					affected: 1,
				}),
			);
		});

		test('throw on duplicate usernames', async () => {
			await expect(service.create(newUser)).resolves.toBeInstanceOf(Object);
			await expect(
				service.create({
					name: newUser.name,
					password: newUser.password + 'a',
					is_intra: newUser.is_intra,
				}),
			).rejects.toThrow('UNIQUE constraint failed');
		});
	});

	describe('UserController', () => {
		it('should get all users', async () => {
			await expect(controller.all()).resolves.toEqual(
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
			await expect(controller.get(seedUsers[0].userId)).resolves.toEqual(
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

		it('should fail if you try to update to an existing username', async () => {
			// const allUsers = await service.all();
			console.log(await service.update(7456, {}));
		});
	});
});
