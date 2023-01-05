import { IsNotEmpty } from 'class-validator';
import { DoesNotMatch } from '../../../shared/does-not-match.decorator';

export class CreateGameDto {
	customization?: string;

	@IsNotEmpty()
	player_one: number;

	@DoesNotMatch(CreateGameDto, (o) => o.player_one)
	@IsNotEmpty()
	player_two: number;
}
