import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { GameInvite } from './entities/game-invite.entity';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';

@Injectable()
export class GameInvitesService extends AbstractService<GameInvite> {
	constructor(
		@InjectRepository(GameInvite)
		protected readonly repository: Repository<GameInvite>,
	) {
		super(repository);
	}

	async createAndSave(data: CreateGameInviteDto): Promise<GameInvite> {
		const newInvite = this.repository.create({
			players: data.players.map((player) => ({ id: player })),
		});

		return this.repository.save(newInvite);
	}
}
