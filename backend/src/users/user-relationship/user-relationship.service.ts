import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SaveOptions } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { CreateUserRelationshipDto } from './dto/create-user-relationship.dto';
import { UserRelationship } from './entities/user-relationship.entity';

@Injectable()
export class UserRelationshipService extends AbstractService<UserRelationship> {
	constructor(
		@InjectRepository(UserRelationship)
		protected readonly repository: Repository<UserRelationship>,
	) {
		super(repository);
	}

	async createAndSave(
		data: CreateUserRelationshipDto,
	): Promise<UserRelationship> {
		console.log('Before create');
		const newInvite: UserRelationship = this.repository.create({
			source_id: data.source_id,
			target_id: data.target_id,
			type: data.type,
		});
		console.log('After create', newInvite);
		return newInvite;
		return this.repository.save(data);
	}
}
