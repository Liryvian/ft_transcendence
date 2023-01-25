import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber()
	source_id: User;

	@IsNumber()
	target_id: User;

	// specifier_id: number;

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
