import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayUnique,
	IsNotEmpty,
	IsNumber,
} from 'class-validator';

export class CreateUserRelationshipDto {
	@IsNumber({}, { each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@ArrayUnique()
	connection: number[];

	@IsNotEmpty()
	type: string;
}
