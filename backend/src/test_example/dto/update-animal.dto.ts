import { IsNotEmpty } from 'class-validator';

export class UpdateAnimalDto {
	@IsNotEmpty()
	name: string;
}
