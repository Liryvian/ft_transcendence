import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsNotEmpty, IsNumber } from 'class-validator';
import ArrayDistinct from './array.validator';

export class CreateGameInviteDto {

	@IsNumber({},{each: true})
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@ArrayUnique()
	players: number[];
}
