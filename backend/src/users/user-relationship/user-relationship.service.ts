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
		sourceId: number,
		targetId: number,
	): Promise<UserRelationship> | null {
		try {
			const relationship: UserRelationship = await this.findOne({
				relations: {
					source: true,
					target: true,
				},
				where: {
					source: {
						id: In([sourceId, targetId]),
					},
					target: {
						id: In([sourceId, targetId]),
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
			relationsRequest.source,
			relationsRequest.target,
		);
		return relation !== null;
	}
}
