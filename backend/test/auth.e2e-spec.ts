import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { UserController } from '../src/user/user.controller';
import { UserModule } from '../src/user/user.module';
import { SharedModule } from '../src/shared/shared.module';
import { AuthModule } from '../src/auth/auth.module';
import { UserService } from '../src/user/user.service';
import { User } from '../src/user/entities/user.entity';
import { InsertResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';

describe('Auth (e2e)', () => {
	let app: INestApplication;
	let userController: UserController;
	let userService: UserService;
	let jwtService: JwtService;

	let users = [
		{
			name: 'u1',
			password: 'p1',
			password_confirm: 'p1',
		},
		{
			name: 'u2',
			password: 'p2',
			password_confirm: 'p2',
		},
		{
			name: 'u3',
			password: 'p3',
			password_confirm: 'p3',
		},
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				SharedModule,
				UserModule,
				AuthModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		app.use(cookieParser());
		await app.init();

		userController = moduleFixture.get<UserController>(UserController);
		userService = moduleFixture.get<UserService>(UserService);
		jwtService = moduleFixture.get<JwtService>(JwtService);

		await userController
			.create(users[0])
			.then((res: InsertResult) => (users[0]['id'] = res.identifiers[0].id));
		await userController
			.create(users[1])
			.then((res: InsertResult) => (users[1]['id'] = res.identifiers[0].id));
		await userController
			.create(users[2])
			.then((res: InsertResult) => (users[2]['id'] = res.identifiers[0].id));
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
					expect(data.id).toBe(users[0]['id']);
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
									id: users[0]['id'],
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
