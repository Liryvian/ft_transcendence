import { IsNotEmpty } from 'class-validator';

export class CreateUserChatDto {
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	chat_id: number;
}
