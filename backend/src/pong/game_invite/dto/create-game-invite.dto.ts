import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameInviteDto {

	@IsNumber({},{each: true})
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@ArrayUnique()
	players: number[];
}
