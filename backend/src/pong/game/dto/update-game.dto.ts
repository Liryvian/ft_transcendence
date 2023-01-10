import { IsOptional } from 'class-validator';

export class UpdateGameDto {
	@IsOptional()
	score_player_one?: number;

	@IsOptional()
	score_player_two?: number;

	@IsOptional()
	is_active?: boolean;
}
