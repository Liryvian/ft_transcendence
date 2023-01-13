import { DoesNotMatch } from '../../../shared/does-not-match.decorator';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameInviteDto {
	@IsNotEmpty()
	@IsNumber()
	source_id: number;

	@IsNotEmpty()
	@IsNumber()
	@DoesNotMatch(CreateGameInviteDto, (o) => o.source_id)
	target_id: number;
}
