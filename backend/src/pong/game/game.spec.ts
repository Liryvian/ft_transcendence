import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { globalValidationPipeOptions } from '../../main.validationpipe';
import { InsertResult } from 'typeorm';

import { CreateGameDto } from './dto/create-game.dto';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { Game, gameStates } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { UserService } from '../../users/user/user.service';
import { AllTestingModule } from '../../shared/test.module';

describe('Game unit tests', () => {
	let service: GameService;
	let controller: GameController;
	let userService: UserService;

	const relationTestUsers: CreateUserDto[] = [
		{ name: 'u1', password: 'p1' },
		{ name: 'u2', password: 'p2' },
		{ name: 'u3', password: 'p3' },
		{ name: 'u4', password: 'p4' },
	];
	let relationTestUsersIds: number[];

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<GameService>(GameService);
		controller = module.get<GameController>(GameController);
		userService = module.get<UserService>(UserService);

		await userService.insert(relationTestUsers).then((res: InsertResult) => {
			relationTestUsersIds = res.identifiers.map((obj) => obj.id);
			return res;
		});
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('CreateGameDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		const testObject = {
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

	describe('Relationship between players and game', () => {
		it('should create a relationship between two users and a game', async () => {
			const result: Game = await service.save({
				player_one: relationTestUsersIds[0],
				player_two: relationTestUsersIds[1],
			});
			expect(result).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					score_player_one: 0,
					score_player_two: 0,
					customization: expect.any(Object),
					state: gameStates.ACTIVE,
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					player_one: relationTestUsersIds[0],
					player_two: relationTestUsersIds[1],
				}),
			);
			await service.remove(result.id);
		});

		it('should not allow same user for p1 and p2', async () => {
			await expect(
				controller.create({
					player_one: relationTestUsersIds[0],
					player_two: relationTestUsersIds[0],
				}),
			).rejects.toThrow(BadRequestException);
		});

		it('should not allow non existent user', async () => {
			await expect(
				controller.create({
					player_one: relationTestUsersIds[0],
					player_two: 89745,
				}),
			).rejects.toThrow(BadRequestException);
		});

		it('should not allow empty users', async () => {
			await expect(
				controller.create({ player_one: null, player_two: null }),
			).rejects.toThrow(BadRequestException);
		});
	});
});
