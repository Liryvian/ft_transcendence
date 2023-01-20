import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
		const newInvite = this.repository.create({
			connection: data.connection.map((connectionId) => ({
				id: connectionId,
			})),
			type: data.type,
		});
		return this.repository.save(newInvite);
	}
}
