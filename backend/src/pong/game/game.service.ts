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
	async hasActiveGame(userId: number) {
		try {
			const gameForPlayer: Game = await this.findOne({
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
			return gameForPlayer;
		} catch (e) {
			return null;
		}
	}

	//  checks first if users already have an
	async checkInitOrThrow(gameData: CreateGameDto): Promise<boolean> {
		const playerOneId: number = gameData.player_one;
		const playerTwoId: number = gameData.player_two;

		const confilcitingGame: Game = await this.getGamesContainingBothUserss(
			playerOneId,
			playerTwoId,
		);

		if (confilcitingGame) {
			throw new BadRequestException('Game exists between the two users');
		}

		const playerOneHasActiveGames: boolean =
			(await this.hasActiveGame(playerOneId)) !== null;

		const playerTwoHasActiveGames: boolean =
			(await this.hasActiveGame(playerTwoId)) !== null;

		if (playerOneHasActiveGames || playerTwoHasActiveGames) {
			throw new BadRequestException('A player already has an active game');
		}

		return true;
	}
}
