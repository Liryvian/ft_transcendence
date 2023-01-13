import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserchatRole } from './entities/userchat-role.entity';

@Injectable()
export class UserchatRoleService extends AbstractService<UserchatRole> {
	constructor(
		@InjectRepository(UserchatRole)
		private readonly userchatRoleRepository: Repository<UserchatRole>,
	) {
		super(userchatRoleRepository);
	}
}
