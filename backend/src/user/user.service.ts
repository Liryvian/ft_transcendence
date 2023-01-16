import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';
import { Game } from '../pong/game/entities/game.entity';
import { GameService } from '../pong/game/game.service';

@Injectable()
export class UserService extends AbstractService<User> {
	constructor(
		@InjectRepository(User) protected readonly repository: Repository<User>,
		private readonly gameService: GameService,
	) {
		super(repository);
	}

	async getGames(id: number): Promise<Game[]> {
		return this.gameService.findAll({
			where: [{ player_one: { id: id } }, { player_two: { id: id } }],
		});
	}
}
