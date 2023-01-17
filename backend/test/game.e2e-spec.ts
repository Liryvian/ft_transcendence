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
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { UserModule } from '../src/user/user.module';
import { User } from '../src/user/entities/user.entity';
import { MatchmakingRequest } from '../src/pong/matchmaking-request/entities/matchmaking-request.entity';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';
import { GameInvite } from '../src/pong/game_invite/entities/game-invite.entity';

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;

	const mockGame: CreateGameDto = { player_one: 1, player_two: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game, User, MatchmakingRequest, GameInvite]),
				GameModule,
				UserModule,
				MatchmakingRequestModule,
				GameInvite
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);

		await gameController.save(mockGame);
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
