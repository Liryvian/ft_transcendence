import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import { UpdateGameInviteDto } from './dto/update-game-invite.dto';
import { GameInvite } from './entities/game-invite.entity';

@Injectable()
export class GameInvitesService extends AbstractService<GameInvite> {
	constructor(
		@InjectRepository(GameInvite)
		private readonly inviteRepo: Repository<GameInvite>,
	) {
		super(inviteRepo);
	}
}
