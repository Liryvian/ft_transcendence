import { IsNotEmpty } from 'class-validator';

export class CreateAnimalDto {
	@IsNotEmpty()
	name: string;
}
