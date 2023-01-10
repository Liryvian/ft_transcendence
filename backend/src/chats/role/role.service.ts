import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends AbstractService<Role> {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) {
		super(roleRepository);
	}
}
