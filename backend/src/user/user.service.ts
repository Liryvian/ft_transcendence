import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';

// TODO - These functions are general and should be placed in an abstract class.

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async all(): Promise<User[]> {
		return this.userRepository.find();
	}

	// TODO - Check if it is a problem that the create function doesn't return the user anymore

	// async create(data): Promise<User> {
	// 	return this.userRepository.save(data);
	// }

	async create(data) {
		try {
			await this.userRepository.save(data);
		} catch (e) {
			throw new BadRequestException('User name should be unique');
		}
	}

	async findOne(condition): Promise<User> {
		return this.userRepository.findOne(condition);
	}
}
