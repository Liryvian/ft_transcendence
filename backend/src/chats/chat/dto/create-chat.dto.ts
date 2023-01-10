import { IsNotEmpty } from 'class-validator';
export class CreateChatDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	visibility: string;

	@IsNotEmpty()
	password: string;
}
