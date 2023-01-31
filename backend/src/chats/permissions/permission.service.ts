import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class PermissionService extends AbstractService<Permission> {
	constructor(
		@InjectRepository(Permission)
		protected readonly repository: Repository<Permission>,
	) {
		super(repository);
	}
}
