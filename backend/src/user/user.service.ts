import { Injectable } from '@nestjs/common';
import { AbstractService } from '../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends AbstractService<User> {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		super(userRepository);
	}
}
