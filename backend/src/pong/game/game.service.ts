import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { InsertResult, Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService extends AbstractService<Game> {
	constructor(
		@InjectRepository(Game)
		protected readonly repository: Repository<Game>,
	) {
		super(repository);
	}
}
