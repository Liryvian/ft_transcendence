import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { InsertResult } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { globalValidationPipeOptions } from '../src/main.validationpipe';

import { User } from '../src/users/user/entities/user.entity';
import { UserController } from '../src/users/user/user.controller';
import { UserService } from '../src/users/user/user.service';
import { AllTestingModule } from '../src/shared/test.module';

describe('Auth (e2e)', () => {
	let app: INestApplication;
	let userController: UserController;
	let userService: UserService;
	let jwtService: JwtService;

	let users = [
		{ name: 'u1', password: 'p1', id: -1 },
		{ name: 'u2', password: 'p2', id: -1 },
		{ name: 'u3', password: 'p3', id: -1 },
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		app.use(cookieParser());
		await app.init();

		userController = moduleFixture.get<UserController>(UserController);
		userService = moduleFixture.get<UserService>(UserService);
		jwtService = moduleFixture.get<JwtService>(JwtService);

		await Promise.all(
			users.map(async (usr, i) => {
				return await userController
					.create({
						name: usr.name,
						password: usr.password,
						password_confirm: usr.password,
					})
					.then((res: InsertResult) => {
						users[i].id = res.identifiers[0].id;
						return res;
					});
			}),
		);
	});

	afterAll(async () => {
		const allUsers: User[] = await userController.findAll();

		userService.remove(allUsers.map((obj) => obj.id));
		app.close();
	});

	describe('/login (POST)', () => {
		it('should register a jwt cookie on login', async () => {
			return request(app.getHttpServer())
				.post('/login')
				.send({ name: users[0].name, password: users[0].password })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.headers.hasOwnProperty('set-cookie')).toBeTruthy();
					const cookie = res.headers['set-cookie'][0]
						.split('=')[1]
						.split(';')[0];
					const data = jwtService.verify(cookie);
					expect(data.id).toBe(users[0].id);
				});
		});
	});

	describe('/logout (POST', () => {
		it('should now allow logout with unauthenticated user', async () => {
			return request(app.getHttpServer())
				.post('/logout')
				.send()
				.expect(HttpStatus.FORBIDDEN);
		});

		it('should clear the cookie of a logged in user', async () => {
			const agent = request.agent(app.getHttpServer());

			await agent
				.post('/login')
				.send({ name: users[0].name, password: users[0].password })
				.then((r) => {
					return agent.post('/logout').expect((s) => {
						expect(s.statusCode).toBe(HttpStatus.OK);
						expect(s.headers['set-cookie']).toEqual(
							expect.arrayContaining([expect.stringContaining('jwt=;')]),
						);
					});
				});
		});
	});

	describe('/me (GET)', () => {
		it('should return the authenticated user', async () => {
			const agent = request.agent(app.getHttpServer());

			await agent
				.post('/login')
				.send({ name: users[0].name, password: users[0].password })
				.then((r) => {
					return agent
						.get('/me')
						.expect(HttpStatus.OK)
						.expect((resp) => {
							expect(resp.body).toEqual(
								expect.objectContaining({
									id: users[0].id,
									name: users[0].name,
									is_intra: false,
								}),
							);
						});
				});
		});

		it('should fail with unauthenticated user', async () => {
			return request(app.getHttpServer())
				.get('/me')
				.expect(HttpStatus.FORBIDDEN);
		});
	});
});
