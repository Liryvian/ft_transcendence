import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { InsertResult } from 'typeorm';
import { globalValidationPipeOptions } from '../../backend/src/main.validationpipe';

import { CreateGameDto } from '../src/pong/game/dto/create-game.dto';
import { Game } from '../src/pong/game/entities/game.entity';
import { GameController } from '../src/pong/game/game.controller';
import { AllTestingModule } from '../src/shared/test.module';
import { UserService } from '../src/users/user/user.service';

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;
	let userService: UserService;

	const mockGame: CreateGameDto = { player_one: 1, player_two: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);
		userService = moduleFixture.get<UserService>(UserService);

		await userService
			.create([
				{ name: 'n1', password: 'p1' },
				{ name: 'n2', password: 'p2' },
			])
			.then((res: InsertResult) => {
				mockGame.player_one = res.identifiers[0].id;
				mockGame.player_two = res.identifiers[1].id;
				return res;
			});

		await gameController.save(mockGame);
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
