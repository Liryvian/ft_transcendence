import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class ChatroomService extends AbstractService<Chatroom> {
	constructor(
		@InjectRepository(Chatroom)
		private readonly chatroomRepository: Repository<Chatroom>,
	) {
		super(chatroomRepository);
	}
}
