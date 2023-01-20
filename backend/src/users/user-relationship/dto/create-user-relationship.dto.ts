import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayUnique,
	IsEnum,
	IsNotEmpty,
	IsNumber,
} from 'class-validator';
import { validRelationships } from '../entities/user-relationship.entity';

export class CreateUserRelationshipDto {
	@IsNumber({}, { each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@ArrayUnique()
	connection: number[];

	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;
}
