import { IsNotEmpty, IsOptional } from 'class-validator';
import { DoesNotMatch } from '../../../shared/does-not-match.decorator';

export class CreateGameDto {
	@IsOptional()
	score_to_win?: number;

	@IsOptional()
	background_color?: string;

	@IsNotEmpty()
	player_one: number;

	@DoesNotMatch(CreateGameDto, (o) => o.player_one)
	@IsNotEmpty()
	player_two: number;
}
