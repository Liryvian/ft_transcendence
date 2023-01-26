import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber()
	source_id: number;

	@IsNumber()
	target_id: number;

	// specifier_id: number;

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
