import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateGameDto } from '../src/pong/game/dto/create-game.dto';
import { Game } from '../src/pong/game/entities/game.entity';
import { GameController } from '../src/pong/game/game.controller';
import { GameModule } from '../src/pong/game/game.module';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import * as request from 'supertest';

describe('GameController (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;

	const mockGame: CreateGameDto = { player_one: 1, player_two: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				GameModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);

		await gameController.create(mockGame);
	});

	afterAll(async () => {
		const allGames: Game[] = await gameController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await gameController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('/games (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/games').expect(HttpStatus.OK);
		});
	});
});
