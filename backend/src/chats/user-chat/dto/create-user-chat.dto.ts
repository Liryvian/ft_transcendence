import { IsNotEmpty } from 'class-validator';

export class CreateUserChatDto {
	//UserId needs to be protected for doubles
	@IsNotEmpty()
	userId: number;

	@IsNotEmpty()
	chatId: number;
}
