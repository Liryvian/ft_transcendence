import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
	customization?: string;

	// player_one id
	@IsNotEmpty()
	user_one: number;

	@IsNotEmpty()
	user_two: number;
}
