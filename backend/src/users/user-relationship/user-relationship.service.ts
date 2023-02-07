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
	async getExistingRelationship(
		source: number,
		target: number,
	): Promise<UserRelationship> | null {
		try {
			const relationship: UserRelationship = await this.findOne({
				relations: {
					source_id: true,
					target_id: true,
				},
				where: {
					source_id: {
						id: In([source, target]),
					},
					target_id: {
						id: In([source, target]),
					},
				},
			});
			return relationship;
		} catch (e) {
			return null;
		}
	}

	async hasExistingRelationship(
		relationsRequest: CreateUserRelationshipDto,
	): Promise<boolean> {
		const relation: UserRelationship = await this.getExistingRelationship(
			relationsRequest.source_id,
			relationsRequest.target_id,
		);
		return relation !== null;
	}
}
