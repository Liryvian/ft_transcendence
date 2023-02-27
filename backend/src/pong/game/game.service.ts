import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService extends AbstractService<Game> {
	constructor(
		@InjectRepository(Game)
		protected readonly repository: Repository<Game>,
	) {
		super(repository);
	}

	// async getExistingGames(p1: number, p2: number): Promise<Game[]> | null {
	// 	try {
	// 		const game: Game[] = await this.findAll({
	// 			relations: {
	// 				player_one: true,
	// 				player_two: true,
	// 			},
	// 			where: {
	// 				player_one: {
	// 					id: In([p1, p2]),
	// 				},
	// 				player_two: {
	// 					id: In([p1, p2]),
	// 				},
	// 			},
	// 		});
	// 		return game;
	// 	} catch (e) {
	// 		return null;
	// 	}
	// }

	async getgamesForOneUser(userId: number) {
		try {
			const gameForPlayer: Game = await this.findOne({
				relations: {
					player_one: true,
					player_two: true,
				},
				where: [
					{
						is_active: true,
						player_one: {
							id: userId,
						},
					},

					{
						is_active: true,
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

	async canInitGame(gameData: CreateGameDto): Promise<boolean> {
		const gamePlayerOne: Game = await this.getgamesForOneUser(
			gameData.player_one,
		);
		console.log('GP!', gamePlayerOne);
		const gamePlayerTwo: Game = await this.getgamesForOneUser(
			gameData.player_two,
		);
		console.log('GP2:', gamePlayerTwo);

		return !gamePlayerOne && !gamePlayerTwo;
	}
}
