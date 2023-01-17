import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { UserModule } from '../src/user/user.module';
import { GameModule } from '../src/pong/game/game.module';
import { User } from '../src/user/entities/user.entity';
import { UserService } from '../src/user/user.service';
import { AuthGuard } from '../src/auth/auth.guard';

describe('AnimalController (e2e)', () => {
	let app: INestApplication;
	let userService: UserService;

	beforeAll(async () => {
		const mock_guard = { CanActivate: jest.fn(() => true) };

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				UserModule,
				GameModule,
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mock_guard)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		userService = moduleFixture.get<UserService>(UserService);

		await userService.create([
			{ name: 'n1', password: 'p1' },
			{ name: 'n2', password: 'p2' },
		]);
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
			it.todo('should save a new image as the current user');
			it.todo('should override a existing new image for the current user');
		});
		describe('DELETE', () => {
			it.todo('should remove the users avatar');
		});
	});

	describe('/users (GET)', () => {
		it('should return an array of all users', () => {
			return request(app.getHttpServer()).get('/users').expect(HttpStatus.OK);
		});
	});
});
