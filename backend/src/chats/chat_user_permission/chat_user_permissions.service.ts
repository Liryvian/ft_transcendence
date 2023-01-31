import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat_User_Permissions } from './entities/chat_user_permission.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class ChatUserPermissionsService extends AbstractService<Chat_User_Permissions> {
	constructor(
		@InjectRepository(Chat_User_Permissions) protected readonly repository: Repository<Chat_User_Permissions>,
	) {
		super(repository);
	}
}
