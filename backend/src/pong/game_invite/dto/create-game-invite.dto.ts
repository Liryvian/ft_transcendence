import { DoesNotMatch } from '../../../shared/does-not-match.decorator';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameInviteDto {
	@IsNotEmpty()
	players: number[];
}
