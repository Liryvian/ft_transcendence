import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAnimalDto {
	@IsNotEmpty()
	@IsEmail()
	name: string;

	parent?: number;
}
