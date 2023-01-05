import { IsNotEmpty } from 'class-validator';
export class CreateChatroomDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	visibility: string;

	@IsNotEmpty()
	password: string;
}
