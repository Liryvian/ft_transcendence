import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChat } from './entities/user-chat.entity';

@Injectable()
export class UserChatService extends AbstractService<UserChat> {
	constructor(
		@InjectRepository(UserChat)
		private readonly userChatRepository: Repository<UserChat>,
	) {
		super(userChatRepository);
	}
}
