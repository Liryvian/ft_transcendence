import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { DoesNotMatch } from '../../../shared/does-not-match.decorator';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber()
	source_id: number;

	@IsNumber()
	@DoesNotMatch(CreateUserRelationshipDto, (o) => o.source_id)
	target_id: number;

	// specifier_id: number;

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
