import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { User } from '../user/entities/user.entity';
import { UserController } from '../user/user.controller';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameService', () => {
	let service: GameService;
	let gameController: GameController;
	let userController: UserController;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game, User]),
			],
			controllers: [GameController, UserController],
			providers: [GameService],
		}).compile();

		service = module.get<GameService>(GameService);
		gameController = module.get<GameController>(GameController);
		userController = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a zeroed game instance', async () => {
		const id_user_one: number = 1;
		const id_user_two: number = 2;
		const data: CreateGameDto = {
			user_one: id_user_one,
			user_two: id_user_two,
		};
		const newGame: Game = await gameController.create(data);
		const expectedResult = {
			user_one: 1,
			user_two: 2,
			score_user_one: 0,
			score_user_two: 0,
			customization: null,
			is_active: true,
		};
		expect(newGame).toMatchObject(expectedResult);
	});
});
