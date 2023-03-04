import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { User } from '../src/users/user/entities/user.entity';
import { UserService } from '../src/users/user/user.service';
import { InsertResult } from 'typeorm';
import { AllTestingModule } from '../src/shared/test.module';
import * as bcrypt from 'bcrypt';

describe('User (e2e)', () => {
	let app: INestApplication;
	let userService: UserService;

	const userIds = [];

	beforeAll(async () => {
		const mock_guard = { CanActivate: jest.fn(() => true) };

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();
		// .overrideGuard(AuthGuard)
		// .useValue(mock_guard)

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		userService = moduleFixture.get<UserService>(UserService);

		await userService
			.insert([
				{ name: 'n1', password: await bcrypt.hash('p1', 11) },
				{ name: 'n2', password: await bcrypt.hash('p2', 11) },
			])
			.then((users: InsertResult) => {
				users.identifiers.forEach((identifier) => {
					userIds.push(identifier.id);
				});
			});
	});

	afterAll(async () => {
		const allUsers: User[] = await userService.findAll();

		if (allUsers.length) {
			userService.remove(allUsers.map((user) => user.id));
		}
		app.close();
	});

	describe('/users/:id/avatar', () => {
		describe('POST', () => {
			it('should save a new image as the current user', async () => {
				const agent = request.agent(app.getHttpServer());

				// THIS IS A WORK IN PROGRESS
				// BUT I CANT GET IT TO WORK..
				await agent
					.post('/login')
					.send({ name: 'n1', password: 'p1' })
					.then((r) => {
						return agent
							.post(`/users/${r.body.id}/avatar`)
							.attach('avatar', './test/test-avatar.png')
							.expect((s) => {
								console.log(s);
								expect(s.statusCode).toBe(HttpStatus.OK);
								expect(s.body.avatar).toEqual(
									expect.stringContaining('u1_avatar.png'),
								);
							});
					});
			});

			it('should not allow another extention than jpg/png/jpeg', async () => {
				const response = await request(app.getHttpServer())
					.post(`/users/${userIds[1]}/avatar`)
					.attach('avatar', './test/dotenv-config.ts')
					.expect(HttpStatus.BAD_REQUEST);
			});
		});
		describe('DELETE', () => {
			it('should remove the users avatar', async () => {
				await request(app.getHttpServer())
					.post(`/users/${userIds[1]}/avatar`)
					.attach('avatar', './test/test-avatar.png');

				const response = await request(app.getHttpServer()).delete(
					`/users/${userIds[1]}/avatar`,
				);
				expect(response.status).toBe(HttpStatus.OK);

				const user: User = await userService.findOne({
					where: { id: userIds[1] },
				});
				expect(user.avatar).toBe(null);
			});
		});
	});

	describe('/users (GET)', () => {
		it('should return an array of all users', () => {
			return request(app.getHttpServer()).get('/users').expect(HttpStatus.OK);
		});
	});
});
