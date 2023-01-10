import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchmakingRequestDto {
	@IsNotEmpty()
	@IsNumber()
	user_id: number;
}
