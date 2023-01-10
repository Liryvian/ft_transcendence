import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatUser } from './entities/chat-user.entity';

@Injectable()
export class ChatUserService extends AbstractService<ChatUser> {
	constructor(
		@InjectRepository(ChatUser)
		private readonly chatUserRepository: Repository<ChatUser>,
	) {
		super(chatUserRepository);
	}
}
