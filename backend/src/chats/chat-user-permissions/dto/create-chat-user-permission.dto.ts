import { IsNotEmpty } from 'class-validator';

export class CreateChatUserPermissionDto {
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty()
	permission_id: number;
}
