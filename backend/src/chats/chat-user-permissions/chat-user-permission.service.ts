import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserPermission } from './entities/chat-user-permission.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class ChatUserPermissionService extends AbstractService<ChatUserPermission> {
	constructor(
		@InjectRepository(ChatUserPermission)
		protected readonly repository: Repository<ChatUserPermission>,
	) {
		super(repository);
	}
}
