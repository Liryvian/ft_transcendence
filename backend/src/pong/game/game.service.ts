import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Socket } from 'socket.io';

@Injectable()
export class GameService extends AbstractService<Game> {
	constructor(
		@InjectRepository(Game)
		protected readonly repository: Repository<Game>,
	) {
		super(repository);
	}

	handShakeWithSocket(socket: Socket) {
		const cookie = socket.handshake.headers.cookie;
	}
}
