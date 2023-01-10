import { Injectable } from '@nestjs/common';
import { CreateChatuserRoleDto } from './dto/create-chatuser-role.dto';
import { UpdateChatuserRoleDto } from './dto/update-chatuser-role.dto';
import { AbstractService } from '../../shared/abstract.service';
import { Message } from '../message/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatuserRole } from './entities/chatuser-role.entity';

@Injectable()
export class ChatuserRoleService extends AbstractService<ChatuserRole> {
	constructor(
		@InjectRepository(ChatuserRole)
		private readonly chatuserRoleRepository: Repository<ChatuserRole>,
	) {
		super(chatuserRoleRepository);
	}
}
