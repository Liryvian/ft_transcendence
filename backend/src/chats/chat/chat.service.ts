import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class ChatService extends AbstractService<Chat> {
	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
	) {
		super(chatRepository);
	}
}
