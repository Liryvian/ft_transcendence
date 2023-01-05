import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
	customization?: string;

	// player_one id
	@IsNotEmpty()
	player_1: number;

	@IsNotEmpty()
	player_2: number;
}
