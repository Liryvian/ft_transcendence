import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
	score_player_one?: number;
	score_player_two?: number;
	is_active?: boolean;
}