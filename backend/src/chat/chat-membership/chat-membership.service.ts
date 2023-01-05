import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMembership } from './entities/chat-membership.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class ChatMembershipService extends AbstractService<ChatMembership> {
	constructor(
		@InjectRepository(ChatMembership)
		private readonly chatMembershipRepository: Repository<ChatMembership>,
	) {
		super(chatMembershipRepository);
	}
}
