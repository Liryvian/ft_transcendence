import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class UserService extends AbstractService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {
		super(userRepository);
	}

	async create(data): Promise<User> {
		try {
			const user = await this.userRepository.save(data);
			if (user) {
				return user;
			}
		} catch (e) {
			throw new BadRequestException('User name should be unique');
		}
	}
}
