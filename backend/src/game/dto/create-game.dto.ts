import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
	customization?: string;

	@IsNotEmpty()
	player_one: number;

	@IsNotEmpty()
	player_two: number;
}
