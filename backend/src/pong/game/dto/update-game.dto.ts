import { IsEnum, IsOptional } from 'class-validator';
import { gameStates, gameStateType } from '../entities/game.entity';

export class UpdateGameDto {
	@IsOptional()
	score_player_one?: number;

	@IsOptional()
	score_player_two?: number;

	@IsOptional()
	@IsEnum(gameStates)
	state?: gameStateType;
}
