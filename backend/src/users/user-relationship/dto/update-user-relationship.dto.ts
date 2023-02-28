import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { validRelationships } from '../entities/user-relationship.entity';
import { CreateUserRelationshipDto } from './create-user-relationship.dto';

export class UpdateUserRelationshipDto extends PartialType(
	CreateUserRelationshipDto,
) {
	@IsEnum(validRelationships)
	@IsNotEmpty()
	type: string;

	@IsNumber()
	specifier_id: number;
}
