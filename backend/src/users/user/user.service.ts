import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class UserService extends AbstractService<User> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {
		super(userRepository);
	}
}
