import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
	customization?: string;

	// player_one id
	@IsNotEmpty()
	player_one: number;

	@IsNotEmpty()
	player_two: number;
}
