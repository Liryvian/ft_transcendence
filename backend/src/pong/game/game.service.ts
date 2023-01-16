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

	// async create(data): Promise<InsertResult> {
	// 	console.log(data);
	// 	const ins: InsertResult = await this.repository.insert(data);
	// 	await this.repository.save({ ...data, id: ins.identifiers[0].id });
	// 	return ins;
	// }

	// async addUser(self: number, userId: number) {
	// 	return this.repository.save([
	// 		{
	// 			id: self,
	// 			users: [{ id: userId }],
	// 		},
	// 	]);
	// }
}
