import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameService', () => {
	let service: GameService;
	let controller: GameController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game]),
			],
			controllers: [GameController],
			providers: [GameService],
		}).compile();

		service = module.get<GameService>(GameService);
		controller = module.get<GameController>(GameController);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a zeroed game instance', async () => {
		const id_player_one: number = 1;
		const id_player_two: number = 2;
		const data: CreateGameDto = {
			player_one: id_player_one,
			player_two: id_player_two,
		};
		const newGame: Game = await controller.create(data);
		const expectedResult = {
			player_one: 1,
			player_two: 2,
			score_player_one: 0,
			score_player_two: 0,
			customization: null,
			is_active: true,
		};
		expect(newGame).toMatchObject(expectedResult);
	});
});
