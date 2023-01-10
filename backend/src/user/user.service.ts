import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends AbstractService<User> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {
		super(userRepository);
	}
}
