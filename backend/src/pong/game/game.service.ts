import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { In, Repository } from 'typeorm';
import { Game, gameStates } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService extends AbstractService<Game> {
	constructor(
		@InjectRepository(Game)
		protected readonly repository: Repository<Game>,
	) {
		super(repository);
	}

	// if a game exists where both players
	async getGamesContainingBothUserss(p1: number, p2: number) {
		try {
			const confilcitingGame: Game = await this.findOne({
				relations: {
					player_one: true,
					player_two: true,
				},
				where: {
					player_one: {
						id: In([p1, p2]),
					},

					player_two: {
						id: In([p1, p2]),
					},
				},
			});
			return confilcitingGame;
		} catch (e) {
			return null;
		}
	}

	// check if a user has any active games
	async getActiveGame(userId: number) {
		try {
			const activeGame: Game = await this.findOne({
				relations: {
					player_one: true,
					player_two: true,
				},
				where: [
					{
						state: gameStates.ACTIVE,
						player_one: {
							id: userId,
						},
					},
					{
						state: gameStates.ACTIVE,
						player_two: {
							id: userId,
						},
					},
				],
			});
			return activeGame;
		} catch (e) {
			return null;
		}
	}

	//  check and get pending game between two users
	async getPendingGame(p1: number, p2: number) {
		try {
			const pendingGame: Game = await this.findOne({
				relations: {
					player_one: true,
					player_two: true,
				},
				where: {
					state: gameStates.PENDING,

					player_one: {
						id: In([p1, p2]),
					},

					player_two: {
						id: In([p1, p2]),
					},
				},
			});
			return pendingGame;
		} catch (e) {
			return null;
		}
	}

	//  checks first if users already have a pending game between them
	//  then checks if either users have an active game going
	async checkInitOrThrow(gameData: CreateGameDto): Promise<boolean> {
		const playerOneId: number = gameData.player_one;
		const playerTwoId: number = gameData.player_two;

		const getPendingGame: Game = await this.getPendingGame(
			playerOneId,
			playerTwoId,
		);

		if (getPendingGame) {
			throw new BadRequestException(
				'Pending game exists between the two users',
			);
		}

		const playerOneHasActiveGames: boolean =
			(await this.getActiveGame(playerOneId)) !== null;

		const playerTwoHasActiveGames: boolean =
			(await this.getActiveGame(playerTwoId)) !== null;

		if (playerOneHasActiveGames || playerTwoHasActiveGames) {
			throw new BadRequestException('A player already has an active game');
		}

		return true;
	}
}
