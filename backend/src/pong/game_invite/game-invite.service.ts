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
		private readonly inviteRepo: Repository<GameInvite>,
	) {
		super(inviteRepo);
	}

	async createAndSave(data: CreateGameInviteDto): Promise<GameInvite> {
		const newInvite = this.inviteRepo.create({
			players: data.players.map((player) => ({ id: player })),
		});

		return this.inviteRepo.save(newInvite);
	}
}
