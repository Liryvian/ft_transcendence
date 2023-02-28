import { IsNotEmpty } from 'class-validator';

export class Activate2FaDto {
	@IsNotEmpty()
	secret: string;

	@IsNotEmpty()
	token: string;
}
