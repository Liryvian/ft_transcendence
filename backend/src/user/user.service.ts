import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';
import { Game } from 'src/pong/game/entities/game.entity';
import { AppModule } from '../app.module';
import { GameService } from '../pong/game/game.service';
import { GameModule } from '../pong/game/game.module';

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
