import { IsNotEmpty } from 'class-validator';

export class CreateUserChatDto {
	//UserId needs to be protected for doubles
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	chat_id: number;
}
