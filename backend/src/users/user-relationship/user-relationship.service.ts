import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
	//  check that id: a - b and id: b - a doesn't already exists
	async hasExistingRelationship(
		relationshipRequest: CreateUserRelationshipDto,
	): Promise<boolean> {
		const relationships: UserRelationship[] = await this.findAll({
			relations: {
				source_id: true,
				target_id: true,
			},
			where: {
				source_id: {
					id: In([
						relationshipRequest.source_id,
						relationshipRequest.target_id,
					]),
				},
				target_id: {
					id: In([
						relationshipRequest.source_id,
						relationshipRequest.target_id,
					]),
				},
			},
		});
		return relationships.length > 0;
	}
}
