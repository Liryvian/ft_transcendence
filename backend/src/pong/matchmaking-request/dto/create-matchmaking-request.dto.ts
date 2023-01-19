import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchmakingRequestDto {
	@IsNotEmpty()
	@IsNumber()
	user: number;
}
