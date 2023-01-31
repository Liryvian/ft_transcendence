import { IsNotEmpty } from 'class-validator';

export class CreateChatUserPermissionsDto {
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty()
	role_id: number;
}
