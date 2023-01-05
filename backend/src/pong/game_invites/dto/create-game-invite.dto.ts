import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameInviteDto {
	@IsNotEmpty()
	@IsNumber()
	source_id: number;

	@IsNotEmpty()
	@IsNumber()
	target_id: number;
}
