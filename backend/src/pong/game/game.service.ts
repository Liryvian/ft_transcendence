import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { UserRelationship } from '../../users/user-relationship/entities/user-relationship.entity';
import { CreateUserRelationshipDto } from '../../users/user-relationship/dto/create-user-relationship.dto';

@Injectable()
export class GameService extends AbstractService<Game> {
	constructor(
		@InjectRepository(Game)
		protected readonly repository: Repository<Game>,
	) {
		super(repository);
	}
}
// 	//  check that id: a - b and id: b - a doesn't already exists
// 	async getExistingRelationship(
// 		player_one: number,
// 		player_twp: number,
// 	): Promise<UserRelationship> | null {
// 		try {
// 			const relationship: UserRelationship = await this.findOne({
// 				relations: {
// 					player_one_id: true,
// 					player_twp_id: true,
// 				},
// 				where: {
// 					player_one_id: {
// 						id: In([player_one, player_twp]),
// 					},
// 					player_twp_id: {
// 						id: In([player_one, player_twp]),
// 					},
// 				},
// 			});
// 			return relationship;
// 		} catch (e) {
// 			return null;
// 		}
// 	}
//
// 	async hasExistingRelationship(
// 		relationsRequest: CreateUserRelationshipDto,
// 	): Promise<boolean> {
// 		const relation: UserRelationship = await this.getExistingRelationship(
// 			relationsRequest.player_one_id,
// 			relationsRequest.player_twp_id,
// 		);
// 		return relation !== null;
// 	}
// }
