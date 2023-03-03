import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { DoesNotMatch } from '../../../shared/does-not-match.decorator';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber()
	source: number;

	@IsNumber()
	@DoesNotMatch(CreateUserRelationshipDto, (o) => o.source)
	target: number;

	@IsNumber()
	specifier_id: number;

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
