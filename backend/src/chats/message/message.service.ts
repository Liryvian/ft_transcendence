import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService extends AbstractService<Message> {
	constructor(
		@InjectRepository(Message)
		protected readonly repository: Repository<Message>,
	) {
		super(repository);
	}
}
