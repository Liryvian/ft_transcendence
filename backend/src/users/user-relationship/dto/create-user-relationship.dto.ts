import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { DoesNotMatch } from '../../../shared/does-not-match.decorator';
import { User } from '../../user/entities/user.entity';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber()
	source_id: User;

	@IsNumber()
	@DoesNotMatch(CreateUserRelationshipDto, (o) => o.source_id)
	target_id: User;

	// specifier_id: number;

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
