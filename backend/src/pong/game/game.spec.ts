import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { globalValidationPipeOptions } from '../../main.validationpipe';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { DataSource, InsertResult } from 'typeorm';

describe('Game unit tests', () => {
	let service: GameService;
	let controller: GameController;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game, User]),
			],
			controllers: [GameController],
			providers: [GameService, UserService],
		}).compile();

		service = module.get<GameService>(GameService);
		controller = module.get<GameController>(GameController);
		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('relationship between players and game', () => {
		it('should', async () => {
			await service.create({});
			userService.getGames(1);
		});

		it('should create a game connected to two players', async () => {
			const test_users: CreateUserDto[] = [
				{ name: 'u1', password: 'p1' },
				{ name: 'u2', password: 'p2' },
				{ name: 'u3', password: 'p3' },
				{ name: 'u4', password: 'p4' },
			];
			let ids: number[];
			await userService.create(test_users).then((res: InsertResult) => {
				ids = res.identifiers.map((obj) => obj.id);
				return res;
			});
			const allUsers = await userService.findAll();
			console.table(allUsers);

			try {
				console.log(
					await service.create({ player_one: ids[0], player_two: ids[1] }),
					await service.create({ playerOneId: ids[0], playerTwoId: ids[1] }),
				);
			} catch (e) {
				console.log(e);
			}

			// const createdGame: InsertResult = await service.create({
			// 	id: 2,
			// 	users: [{ id: ids[1] }, { id: ids[2] }],
			// });
			// const gameIds = createdGame.identifiers.map((obj) => obj.id);
			// try {
			// 	console.log(await service.addUser(gameIds[0], ids[0]));
			// } catch (e) {
			// 	console.log(e);
			// }
			// console.log(
			// 	JSON.stringify(
			// 		await service.findAll({ relations: ['users'] }),
			// 		null,
			// 		2,
			// 	),
			// );
			/*
			// for many-to-one / one-to-many
			try {
				console.log(
					await service.update(createdGame.identifiers[0].id, {
						users: [{ id: 1 }, { id: 2 }],
					}),
				);
			} catch (e) {
				console.log(e);
			}

			try {
				console.log(
					await userService.update(ids[0], {
						game: createdGame.identifiers[0].id,
					}),
					await userService.update(ids[1], {
						game: createdGame.identifiers[0].id,
					}),
				);
			} catch (e) {
				console.log(e);
			}

			const game = await service.findAll({ relations: ['users'] });
			console.log(JSON.stringify(game, null, 2));
			console.log(await userService.findAll({ relations: ['game'] }));
*/
			// let createdGameInsert: InsertResult;
			// try {
			// 	createdGameInsert = await service.create({
			// 		// playerOneId: allUsers[0].id,
			// 		playerOneId: { id: allUsers[0].id },
			// 		// playerOneId: allUsers[0],
			// 		is_active: false,
			// 		// playerTwo: allUsers[1],
			// 	});
			// 	console.log(createdGameInsert?.identifiers);
			// 	const createdGame: Game = await service.findOne({
			// 		where: { id: createdGameInsert.identifiers[0].id },
			// 		relations: {
			// 			player_one: true,
			// 			// player_two: true,
			// 		},
			// 	});
			// 	console.log(createdGame);
			// } catch (e) {
			// 	console.log('err:', e);
			// }
		});
	});

	describe('CreateGameDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		let testObject = {
			player_one: 1,
			player_two: 1,
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateGameDto,
		};

		it('should throw an error when player 1 & 2 have the same id', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when player_one is empty', async () => {
			testObject.player_one = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when player_two is empty', async () => {
			testObject.player_one = 1;
			testObject.player_two = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('updateGameDto', () => {
		it('should not throw an error when update object is empty', async () => {
			const validator = new ValidationPipe(globalValidationPipeOptions());
			const testObject = {};

			const meta: ArgumentMetadata = {
				type: 'body',
				metatype: UpdateGameDto,
			};

			expect(await validator.transform(testObject, meta)).toBeTruthy();
		});
	});
});
