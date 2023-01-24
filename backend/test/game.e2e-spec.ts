import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { globalValidationPipeOptions } from '../../backend/src/main.validationpipe';
import { InsertResult } from 'typeorm';
import { CreateGameDto } from '../src/pong/game/dto/create-game.dto';
import { Game } from '../src/pong/game/entities/game.entity';
import { GameController } from '../src/pong/game/game.controller';
import { AllTestingModule } from '../src/shared/test.module';
import { CreateUserDto } from '../src/users/user/dto/create-user.dto';
import { UserService } from '../src/users/user/user.service';

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;
	let userService: UserService;

	// Setting id's below
	const mockGame: CreateGameDto = { player_one: 0, player_two: 0 };
	const mockUsers: CreateUserDto[] = [
		{ name: 'Galjoen', password: 'G' },
		{ name: 'Worshond', password: 'W' },
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);
		userService = moduleFixture.get<UserService>(UserService);

		await userService.insert(mockUsers).then((res: InsertResult) => {
			mockGame.player_one = res.identifiers[0].id;
			mockGame.player_two = res.identifiers[1].id;
			return res;
		});

		await gameController.create(mockGame);
	});

	afterAll(async () => {
		const allGames: Game[] = await gameController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await gameController.remove(allGames[index].id);
		}

		userService.findAll().then((users) => {
			userService.remove(users.map((u) => u.id));
		});
		app.close();
	});

	describe('/games (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/games').expect(HttpStatus.OK);
		});
	});
});
