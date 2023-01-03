import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
	score_user_one?: number;
	score_user_two?: number;
	is_active?: boolean;
}
