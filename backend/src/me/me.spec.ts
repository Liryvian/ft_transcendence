import { Test, TestingModule } from '@nestjs/testing';
import { MeController } from './me.controller';
import * as request from 'supertest';
import { UserService } from '../users/user/user.service';
import { InsertResult } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserController } from '../users/user/user.controller';
import { AllTestingModule } from '../shared/test.module';

describe('MeController', () => {
	let app: INestApplication;
	let userController: UserController;
	let controller: MeController;
	let userService: UserService;

	let users = [
		{ name: 'u1', password: 'p1', id: -1 },
		{ name: 'u2', password: 'p2', id: -1 },
		{ name: 'u3', password: 'p3', id: -1 },
	];

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = module.createNestApplication();
		userService = module.get<UserService>(UserService);
		userController = module.get<UserController>(UserController);
		controller = module.get<MeController>(MeController);

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

	it('should be defined', () => {
		expect(controller).toBeDefined();
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
